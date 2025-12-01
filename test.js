import https from "https";
import puppeteer from "puppeteer";
import fs from "fs";


async function launchBrowser() {
    return await puppeteer.launch({
        headless: "new", // Performans ve güncel standart için 'new'
        defaultViewport: null,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // Railway bellek yönetimi için kritik
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
            "--no-zygote",
            "--single-process", // Thread/Process limitine takılmamak için (Senin tercihin)
        ],
    });
}

async function safeClose(browser) {
    if (browser) {
        try {
            await browser.close();
        } catch (e) {
            console.error("Browser normal yolla kapanmadı, process kill ediliyor...", e.message);
            try {
                const browserProcess = browser.process();
                if (browserProcess) {
                    browserProcess.kill('SIGINT');
                }
            } catch (killError) {
                console.error("Process kill işlemi de başarısız oldu:", killError.message);
            }
        }
    }
}


const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

let exportFolder = "./src/crawler/testExports/";
if (!fs.existsSync(exportFolder)) {
    fs.mkdirSync(exportFolder, { recursive: true });
}

function createPriceDocument(company, pricesObj) {
    return {
        company,
        updateDate: new Date(),
        fetchDate: new Date(),
        prices: pricesObj,
        exchangeRates: { USD: null, EUR: null },
    };
}


// KARDEMİR
async function crawlKardemir() {
    let browser;
    try {
        browser = await launchBrowser(); // Helper'dan browser al
        const page = await browser.newPage();
        // Timeout süresini single-process olduğu için artırdık (60sn)
        page.setDefaultNavigationTimeout(60000);

        await page.goto("https://www.kardemir.com/hurda_alim_fiyatlari", {
            waitUntil: "networkidle2",
        });

        await page.waitForSelector("div.middlecontent", { timeout: 15000 });

        const result = await page.evaluate(() => {
            const container = document.querySelector("div.middlecontent");
            let dateText = "";
            let prices = [];
            if (container) {
                const dateEl = container.querySelector("h4.ng-binding");
                if (dateEl) dateText = dateEl.innerText.trim();
                const karEl = container.querySelector("kar.ng-binding");
                if (karEl) {
                    const ulEl = karEl.querySelector("ul");
                    if (ulEl) {
                        ulEl.querySelectorAll("li").forEach((li) => {
                            const text = li.innerText.trim();
                            const parts = text.split(":");
                            if (parts.length >= 2) {
                                const material = parts[0].trim();
                                let priceText = parts[1].trim().replace(/TL\/Ton|TL|\/Ton/g, "").trim().replace(/\./g, "");
                                prices.push({ material, price: priceText });
                            }
                        });
                    }
                }
            }
            return { date: dateText, prices };
        });

        let formattedDate = result.date;
        if (result.date.includes("/")) {
            const parts = result.date.split("/");
            if (parts.length === 3) formattedDate = `${parts[0]}.${parts[1]}.${parts[2]}`;
        }
        const description = `Fiyatlar ${formattedDate} tarihinden itibaren geçerli fiyatlardır.`;

        const mapped = mapKardemir(result.prices);
        const finalDoc = { ...createPriceDocument("Kardemir", mapped), description, raw: result };

        fs.writeFileSync(`${exportFolder}kardemir_db.json`, JSON.stringify(finalDoc, null, 2), "utf-8");
        // await Price.create(finalDoc);
        console.log(finalDoc)
        console.log("Kardemir verisi MongoDB'ye kaydedildi.");

    } catch (error) {
        console.error("Kardemir Crawl Hatası:", error.message);
    } finally {
        // BURASI ÇOK ÖNEMLİ: Hata olsa da olmasa da öldür
        await safeClose(browser);
    }
}

async function runAll() {
    try {
        // Connect to MongoDB
        // await connectDB();
        // console.log("MongoDB bağlantısı kuruldu, crawler işlemleri başlatılıyor...");

        // Run crawlers sequentially
        const crawlers = [
            { name: "Kardemir", func: crawlKardemir },
        ];

        for (const crawler of crawlers) {
            try {
                console.log(`${crawler.name} crawler işlemi başlatılıyor...`);
                await crawler.func();
                console.log(`${crawler.name} crawler işlemi başarıyla tamamlandı.`);
            } catch (error) {
                // Bu blok genelde çalışmaz çünkü fonksiyonların içinde try-catch var,
                // ama ekstra güvenlik için bırakıyoruz.
                console.error(`${crawler.name} crawler işleminde beklenmedik hata:`, error.message);
                continue;
            }
        }

        console.log("Tüm crawler işlemleri tamamlandı.");
    } catch (error) {
        console.error("Genel akış hatası:", error);
    }
}

runAll()