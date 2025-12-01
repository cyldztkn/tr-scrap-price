import fetch from "node-fetch";
import https from "https";
import puppeteer from "puppeteer";
import fs from "fs";
import mongoose from "mongoose";
import Price from "../models/Price.js";
import config from "../config/config.js";

// ------------------------------
// YARDIMCI FONKSİYONLAR (Helpers)
// ------------------------------

// 1. Standart Tarayıcı Başlatma Ayarları
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

// 2. Güvenli Kapatma ve Zombie Process Öldürme
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

// MongoDB connection 
async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(config.mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB bağlantısı başarılı");
    } catch (error) {
        console.error("MongoDB bağlantı hatası:", error);
        process.exit(1);
    }
}

// General HTTPS Agent
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

// ------------------------------
// Mapping Functions (Aynen korundu)
// ------------------------------
function mapKardemir(pricesArr) {
    const result = { DKP: null, Ekstra: null, Grup1: null, Grup2: null, Talas: null };
    pricesArr.forEach((item) => {
        const mat = item.material.toLowerCase();
        const value = parseInt(item.price.replace(/\D/g, ""), 10);
        if (mat.includes("dkp hurda")) result.DKP = value;
        else if (mat === "extra") result.Ekstra = value;
        else if (mat.includes("1.sınıf")) result.Grup1 = value;
        else if (mat.includes("2.sınıf")) result.Grup2 = value;
    });
    return result;
}

function mapIsdemir(pricesArr) {
    const result = { DKP: null, Ekstra: null, Grup1: null, Grup2: null, Talas: null };
    pricesArr.forEach((item) => {
        const mat = item.material.toLowerCase();
        const value = parseInt(item.price.replace(/\D/g, ""), 10);
        if (mat.includes("dkp")) result.DKP = value;
        else if (mat.includes("ekstra")) result.Ekstra = value;
        else if (mat.includes("1.grup")) result.Grup1 = value;
        else if (mat.includes("2.grup")) result.Grup2 = value;
    });
    return result;
}

function mapColakoglu(pricesArr) {
    const result = { DKP: null, Ekstra: null, Grup1: null, Grup2: null, Talas: null };
    pricesArr.forEach((item) => {
        const mat = item.name ? item.name.toLowerCase() : "";
        const value = Number(item.price);
        if (mat.includes("dkp")) result.DKP = value;
        else if (mat.includes("ekstra")) result.Ekstra = value;
        else if (mat.includes("1.grup")) result.Grup1 = value;
        else if (mat.includes("2.grup")) result.Grup2 = value;
        else if (mat.includes("talaş")) result.Talas = value;
    });
    return result;
}

function mapErdemir(pricesArr) {
    const result = { DKP: null, Ekstra: null, Grup1: null, Grup2: null, Talas: null };
    pricesArr.forEach((item) => {
        if (item.new_price) {
            const value = parseInt(item.new_price.replace(/\D/g, ""), 10);
            const mat = item.material.toLowerCase();
            if (mat.includes("dkp")) result.DKP = value;
            else if (mat.includes("ekstra")) result.Ekstra = value;
            else if (mat.includes("1. grup")) result.Grup1 = value;
            else if (mat.includes("2. grup")) result.Grup2 = value;
        }
    });
    return result;
}

function mapAsilCelik(pricesArr) {
    const result = { DKP: null, Ekstra: null, Grup1: null, Grup2: null, Talas: null };
    pricesArr.forEach((item) => {
        const mat = item.material.toLowerCase();
        const value = parseInt(item.price.replace(/\D/g, ""), 10);
        if (mat.includes("dkp")) result.DKP = value;
        else if (mat.includes("ekstra")) result.Ekstra = value;
        else if (mat.includes("1. sınıf")) result.Grup1 = value;
    });
    return result;
}

function mapKromancelik(pricesArr) {
    const result = { DKP: null, Ekstra: null, Grup1: null, Grup2: null, Talas: null };
    pricesArr.forEach((item) => {
        const mat = item.material.toLowerCase();
        const value = parseInt(item.price.replace(/\D/g, ""), 10);
        if (mat === "dkp") result.DKP = value;
        else if (mat.includes("ekstra") && !mat.includes("bonus")) result.Ekstra = value;
        else if (mat.includes("1_sinif")) result.Grup1 = value;
        else if (mat.includes("2_sinif")) result.Grup2 = value;
        else if (mat.includes("talas")) result.Talas = value;
    });
    return result;
}

// ------------------------------
// Scraper Functions (Her biri kendi browser'ını açar ve KAPATIR)
// ------------------------------

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
        await Price.create(finalDoc);
        console.log("Kardemir verisi MongoDB'ye kaydedildi.");

    } catch (error) {
        console.error("Kardemir Crawl Hatası:", error.message);
    } finally {
        // BURASI ÇOK ÖNEMLİ: Hata olsa da olmasa da öldür
        await safeClose(browser);
    }
}

// Isdemir
async function scrapeIsdemir() {
    let browser;
    try {
        browser = await launchBrowser();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);

        await page.goto("https://www.isdemir.com.tr/tedarikci-iliskileri/hurda-alim", { waitUntil: "networkidle2" });
        const data = await page.evaluate(() => {
            const date = document.querySelector("main > article > div:nth-child(2) div div p:nth-child(3)")?.textContent;
            const rows = document.querySelectorAll("main article table tbody tr");
            const prices = [];
            rows.forEach((row) => {
                const cols = row.querySelectorAll("td");
                if (cols.length >= 2) {
                    prices.push({ material: cols[0].textContent.trim(), price: cols[1].textContent.trim() });
                }
            });
            return { date, prices };
        });

        const mapped = mapIsdemir(data.prices);
        const doc = createPriceDocument("Isdemir", mapped);
        fs.writeFileSync(`${exportFolder}isdemir_db.json`, JSON.stringify(doc, null, 2), "utf-8");
        await Price.create(doc);
        console.log("Isdemir verisi MongoDB'ye kaydedildi.");
    } catch (error) {
        console.error("Isdemir Hatası:", error.message);
    } finally {
        await safeClose(browser);
    }
}

// Çolakoğlu (Fetch kullanıyor, browser açmaya gerek yok)
async function fetchColakoglu() {
    try {
        const response = await fetch("https://client.colakoglu.com.tr/webservice/scrap-price", {
            agent: httpsAgent,
            headers: {
                accept: "*/*",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                Referer: "https://www.colakoglu.com.tr/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            method: "GET",
        });
        const data = await response.json();
        const mapped = mapColakoglu(data.prices);
        const doc = createPriceDocument("Colakoglu", mapped);
        fs.writeFileSync(`${exportFolder}colakoglu_db.json`, JSON.stringify(doc, null, 2), "utf-8");
        await Price.create(doc);
        console.log("Colakoglu verisi MongoDB'ye kaydedildi.");
    } catch (err) {
        console.error("Colakoglu Hatası:", err.message);
    }
}

// Erdemir
async function scrapeErdemir() {
    let browser;
    try {
        browser = await launchBrowser();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);

        await page.goto("https://www.erdemir.com.tr/tedarikci-iliskileri/hurda-alim", { waitUntil: "networkidle2" });
        const data = await page.evaluate(() => {
            let dateText = "";
            document.querySelectorAll("p").forEach((p) => {
                if (p.innerText.includes("Fiyatlar") && p.innerText.includes("tarihinden")) {
                    dateText = p.innerText.trim();
                }
            });
            const rows = document.querySelectorAll("table.table.table-zebra tbody tr");
            const prices = [];
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                let material = cells[0] ? cells[0].innerText.trim() : "";
                let yeniPriceRaw = cells[2] ? cells[2].innerText.replace(/\s/g, "") : "";
                let yeniMatch = yeniPriceRaw.match(/(\d+[\.,]?\d*)/);
                const new_price = yeniMatch ? yeniMatch[1].replace(",", ".") : null;
                prices.push({ material, new_price });
            });
            return { date: dateText, prices };
        });

        const mapped = mapErdemir(data.prices);
        const doc = createPriceDocument("Erdemir", mapped);
        fs.writeFileSync(`${exportFolder}/erdemir_db.json`, JSON.stringify(doc, null, 2), "utf-8");
        await Price.create(doc);
        console.log("Erdemir verisi MongoDB'ye kaydedildi.");
    } catch (error) {
        console.error("Erdemir Hatası:", error.message);
    } finally {
        await safeClose(browser);
    }
}

// Asil Çelik
async function scrapeAsilCelik() {
    let browser;
    try {
        browser = await launchBrowser();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);

        await page.goto("https://asilcelik.com.tr/tedarikci-iliskileri", { waitUntil: "networkidle2" });
        const data = await page.evaluate(() => {
            const rows = document.querySelectorAll("table tbody tr");
            const prices = [];
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                const material = cells[0].innerText.trim();
                const priceMatch = cells[1].innerText.match(/(\d+)/);
                prices.push({ material, price: priceMatch ? priceMatch[1] : null });
            });
            return { prices };
        });

        const mapped = mapAsilCelik(data.prices);
        const doc = createPriceDocument("Asil Çelik", mapped);
        fs.writeFileSync(`${exportFolder}/asilcelik_db.json`, JSON.stringify(doc, null, 2), "utf-8");
        await Price.create(doc);
        console.log("Asil Çelik verisi MongoDB'ye kaydedildi.");
    } catch (error) {
        console.error("Asil Çelik Hatası:", error.message);
    } finally {
        await safeClose(browser);
    }
}

// Kromancelik
async function scrapeKromancelik() {
    let browser;
    try {
        browser = await launchBrowser();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);

        await page.goto("https://www.kromancelik.com.tr/hurda-tedarik.php", { waitUntil: "networkidle2" });
        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll("section#hurda table tbody tr"));
            const prices = [];
            for (let i = 0; i < rows.length; i += 2) {
                const headerRow = rows[i];
                const valueRow = rows[i + 1];
                if (!headerRow || !valueRow) break;
                const headerCells = Array.from(headerRow.querySelectorAll("td"));
                const valueCells = Array.from(valueRow.querySelectorAll("td"));
                for (let j = 0; j < headerCells.length && j < valueCells.length; j++) {
                    const material = headerCells[j].innerText.trim();
                    let priceText = valueCells[j].innerText.trim().replace("TL", "").trim();
                    const match = priceText.match(/(\d+[.,]?\d*)/);
                    const price = match ? match[1].replace(",", ".") : null;
                    prices.push({ material, price });
                }
            }
            return { prices };
        });

        const mapped = mapKromancelik(data.prices);
        const doc = createPriceDocument("Kromancelik", mapped);
        fs.writeFileSync(`${exportFolder}kromancelik_db.json`, JSON.stringify(doc, null, 2), "utf-8");
        await Price.create(doc);
        console.log("Kromancelik verisi MongoDB'ye kaydedildi.");
    } catch (error) {
        console.error("Kromancelik Hatası:", error.message);
    } finally {
        await safeClose(browser);
    }
}

// ------------------------------
// Run all crawlers
// ------------------------------
export default async function runAll() {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("MongoDB bağlantısı kuruldu, crawler işlemleri başlatılıyor...");

        // Run crawlers sequentially
        const crawlers = [
            { name: "Kardemir", func: crawlKardemir },
            { name: "Colakoglu", func: fetchColakoglu },
            { name: "Erdemir", func: scrapeErdemir },
            { name: "Asil Çelik", func: scrapeAsilCelik },
            { name: "Kromancelik", func: scrapeKromancelik },
            { name: "Isdemir", func: scrapeIsdemir },
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