import fetch from "node-fetch";
import https from "https";
import puppeteer from "puppeteer";
import fs from "fs";
import mongoose from "mongoose";
import Price from "../models/Price.js";
import config from "../config/config.js";

// MongoDB bağlantı fonksiyonu
async function connectDB() {
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

// Genel HTTPS Agent (sertifika kontrolü yapılmadan)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Crawler test export directiory
let exportFolder = "./src/crawler/testExports/";

// Genel dönüşüm fonksiyonu: MongoDB şemasına uygun obje oluşturur.
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
// Mapping Fonksiyonları
// ------------------------------

// 1. KARDEMİR mapping (kaynak: kardemir_fiyat.json)
// Kaynak veride 6 satır var; biz için kullanacağımızlar:
//   • DKP: "DKP Hurda"
//   • Ekstra: "Extra"
//   • Grup1: "1.Sınıf"
//   • Grup2: "2.Sınıf"
//   • Talas: yok, null
function mapKardemir(pricesArr) {
  const result = {
    DKP: null,
    Ekstra: null,
    Grup1: null,
    Grup2: null,
    Talas: null,
  };
  pricesArr.forEach((item) => {
    const mat = item.material.toLowerCase();
    // Fiyatı sadece rakamlara çeviriyoruz (örneğin "14000")
    const value = parseInt(item.price.replace(/\D/g, ""), 10);
    if (mat.includes("dkp hurda")) {
      result.DKP = value;
    } else if (mat === "extra") {
      result.Ekstra = value;
    } else if (mat.includes("1.sınıf")) {
      result.Grup1 = value;
    } else if (mat.includes("2.sınıf")) {
      result.Grup2 = value;
    }
    // "Özel Ekstra" ve "Büyük Parça İskontosu" gibi satırlar, şemamızda yer almadığından atlıyoruz.
  });
  return result;
}

// 2. İsdemir mapping
// Kaynak: isdemir_fiyat.json
// Kullanılanlar:
//   • DKP, Ekstra, 1.Grup, 2.Grup
function mapIsdemir(pricesArr) {
  const result = {
    DKP: null,
    Ekstra: null,
    Grup1: null,
    Grup2: null,
    Talas: null,
  };
  pricesArr.forEach((item) => {
    const mat = item.material.toLowerCase();
    const value = parseInt(item.price.replace(/\D/g, ""), 10);
    if (mat.includes("dkp")) {
      result.DKP = value;
    } else if (mat.includes("ekstra")) {
      result.Ekstra = value;
    } else if (mat.includes("1.grup")) {
      result.Grup1 = value;
    } else if (mat.includes("2.grup")) {
      result.Grup2 = value;
    }
    // "Bonus" ve "Makas" gibi ifadeler şemaya uymadığından atlanır.
  });
  return result;
}

// 3. Çolakoğlu mapping
// Kaynak: colakoglu_fiyat.json – burada fiyatlar alanı "name" ile veriliyor.
function mapColakoglu(pricesArr) {
  const result = {
    DKP: null,
    Ekstra: null,
    Grup1: null,
    Grup2: null,
    Talas: null,
  };
  pricesArr.forEach((item) => {
    const mat = item.name ? item.name.toLowerCase() : "";
    const value = Number(item.price);
    if (mat.includes("dkp")) {
      result.DKP = value;
    } else if (mat.includes("ekstra")) {
      result.Ekstra = value;
    } else if (mat.includes("1.grup")) {
      result.Grup1 = value;
    } else if (mat.includes("2.grup")) {
      result.Grup2 = value;
    } else if (mat.includes("talaş")) {
      result.Talas = value;
    }
  });
  return result;
}

// 4. Erdemir mapping
// Kaynak: Erdemir_fiyat.json – burada her obje "old_price" ve "new_price" içeriyor,
// biz "new_price" değerini kullanıyoruz.
function mapErdemir(pricesArr) {
  const result = {
    DKP: null,
    Ekstra: null,
    Grup1: null,
    Grup2: null,
    Talas: null,
  };
  pricesArr.forEach((item) => {
    if (item.new_price) {
      const value = parseInt(item.new_price.replace(/\D/g, ""), 10);
      const mat = item.material.toLowerCase();
      if (mat.includes("dkp")) {
        result.DKP = value;
      } else if (mat.includes("ekstra")) {
        result.Ekstra = value;
      } else if (mat.includes("1. grup")) {
        result.Grup1 = value;
      } else if (mat.includes("2. grup")) {
        result.Grup2 = value;
      }
    }
  });
  return result;
}

// 5. Asil Çelik mapping
// Kaynak: asilCelik_fiyat.json – burada "Bonus" da var, ancak şemamızda yer yok.
function mapAsilCelik(pricesArr) {
  const result = {
    DKP: null,
    Ekstra: null,
    Grup1: null,
    Grup2: null,
    Talas: null,
  };
  pricesArr.forEach((item) => {
    const mat = item.material.toLowerCase();
    const value = parseInt(item.price.replace(/\D/g, ""), 10);
    if (mat.includes("dkp")) {
      result.DKP = value;
    } else if (mat.includes("ekstra")) {
      result.Ekstra = value;
    } else if (mat.includes("1. sınıf")) {
      result.Grup1 = value;
    }
    // "Bonus" yok sayılıyor.
  });
  return result;
}

// 6. Kromancelik mapping
// Kaynak: kromancelik_fiyat.json – burada farklı materyaller var; biz şemamız için
// sadece DKP, EKSTRA, 1_SINIF, 2_SINIF ve TALAS'ı kullanıyoruz.
function mapKromancelik(pricesArr) {
  const result = {
    DKP: null,
    Ekstra: null,
    Grup1: null,
    Grup2: null,
    Talas: null,
  };
  pricesArr.forEach((item) => {
    const mat = item.material.toLowerCase();
    const value = parseInt(item.price.replace(/\D/g, ""), 10);
    if (mat === "dkp") {
      result.DKP = value;
    } else if (mat.includes("ekstra") && !mat.includes("bonus")) {
      result.Ekstra = value;
    } else if (mat.includes("1_sinif")) {
      result.Grup1 = value;
    } else if (mat.includes("2_sinif")) {
      result.Grup2 = value;
    } else if (mat.includes("talas")) {
      result.Talas = value;
    }
  });
  return result;
}

// ------------------------------
// Fonksiyonlar: Her şirketin verisini çekme ve dönüştürme
// ------------------------------

// KARDEMİR
async function crawlKardemir() {
  const browser = await puppeteer.launch({
    headless: true, // Headless modu açık, test için headless:false kullanabilirsiniz
    defaultViewport: null,
   args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.kardemir.com/hurda_alim_fiyatlari", {
      waitUntil: "networkidle2",
    });

    // İlgili container ve alt öğelerin yüklenmesini bekleyelim:
    await page.waitForSelector("div.middlecontent", { timeout: 10000 });
    await page.waitForSelector("div.middlecontent h4.ng-binding", {
      timeout: 10000,
    });
    await page.waitForSelector("div.middlecontent kar.ng-binding ul", {
      timeout: 10000,
    });

    // Container içerisindeki tarih ve fiyat listesini çekelim.
    const result = await page.evaluate(() => {
      const container = document.querySelector("div.middlecontent");
      let dateText = "";
      let prices = [];
      if (container) {
        // Tarih: <h4 class="ng-binding">26/03/2025</h4>
        const dateEl = container.querySelector("h4.ng-binding");
        if (dateEl) {
          dateText = dateEl.innerText.trim();
        }
        // Fiyat listesinin bulunduğu alan: <kar ...><ul><li>...</li></ul></kar>
        const karEl = container.querySelector("kar.ng-binding");
        if (karEl) {
          const ulEl = karEl.querySelector("ul");
          if (ulEl) {
            const liEls = ulEl.querySelectorAll("li");
            liEls.forEach((li) => {
              const text = li.innerText.trim();
              const parts = text.split(":");
              if (parts.length >= 2) {
                const material = parts[0].trim();
                let priceText = parts[1].trim();
                // "TL", "TL/Ton" veya "/Ton" ifadelerini kaldırıp, noktaları silerek numerik değeri elde ediyoruz.
                priceText = priceText.replace(/TL\/Ton|TL|\/Ton/g, "").trim();
                priceText = priceText.replace(/\./g, "");
                prices.push({ material, price: priceText });
              }
            });
          }
        }
      }
      return { date: dateText, prices };
    });

    await browser.close();

    // Gelen tarih formatı "26/03/2025" ise, nokta ayracı ile "26.03.2025" formatına çevirelim.
    let formattedDate = result.date;
    if (result.date.includes("/")) {
      const parts = result.date.split("/");
      if (parts.length === 3) {
        formattedDate = `${parts[0]}.${parts[1]}.${parts[2]}`;
      }
    }
    const description = `Fiyatlar ${formattedDate} tarihinden itibaren geçerli fiyatlardır.`;

    // Daha önce tanımlı mapKardemir fonksiyonunu kullanarak, ham fiyat listesini MongoDB şemasına uygun hale getiriyoruz.
    const mapped = mapKardemir(result.prices);
    const doc = createPriceDocument("Kardemir", mapped);
    const finalDoc = {
      ...doc,
      description,
      raw: result, // isteğe bağlı: ham veriyi ekliyoruz
    };

    fs.writeFileSync(
      `${exportFolder}kardemir_db.json`,
      JSON.stringify(finalDoc, null, 2),
      "utf-8"
    );
    // MongoDB'ye yeni kayıt olarak ekle
    await Price.create(finalDoc);
    console.log("Kardemir verisi MongoDB'ye kaydedildi.");
  } catch (error) {
    console.error("Kardemir Crawl Hatası:", error);
    await browser.close();
  }
}

// İsdemir (puppeteer ile)
async function scrapeIsdemir() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
   args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(
      "https://www.isdemir.com.tr/tedarikci-iliskileri/hurda-alim",
      { waitUntil: "networkidle2" }
    );
    const data = await page.evaluate(() => {
      const date = document.querySelector(
        "main > article > div:nth-child(2) div div p:nth-child(3)"
      )?.textContent;
      const table = document.querySelector("main article table tbody");
      const rows = table ? table.querySelectorAll("tr") : [];
      const prices = [];
      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 2) {
          prices.push({
            material: cols[0].textContent.trim(),
            price: cols[1].textContent.trim(),
          });
        }
      });
      return { date, prices };
    });
    await browser.close();
    const mapped = mapIsdemir(data.prices);
    const doc = createPriceDocument("Isdemir", mapped);
    fs.writeFileSync(
      `${exportFolder}isdemir_db.json`,
      JSON.stringify(doc, null, 2),
      "utf-8"
    );
    // MongoDB'ye yeni kayıt olarak ekle
    await Price.create(doc);
    console.log("Isdemir verisi MongoDB'ye kaydedildi.");
  } catch (error) {
    console.error("Isdemir Hatası:", error);
    await browser.close();
  }
}

// Çolakoğlu (fetch)
async function fetchColakoglu() {
  try {
    const response = await fetch(
      "https://client.colakoglu.com.tr/webservice/scrap-price",
      {
        agent: httpsAgent,
        headers: {
          accept: "*/*",
          "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          Referer: "https://www.colakoglu.com.tr/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        method: "GET",
      }
    );
    const data = await response.json();
    const mapped = mapColakoglu(data.prices);
    const doc = createPriceDocument("Colakoglu", mapped);
    fs.writeFileSync(
      `${exportFolder}colakoglu_db.json`,
      JSON.stringify(doc, null, 2),
      "utf-8"
    );
    // MongoDB'ye yeni kayıt olarak ekle
    await Price.create(doc);
    console.log("Colakoglu verisi MongoDB'ye kaydedildi.");
  } catch (err) {
    console.error("Colakoglu Hatası:", err);
  }
}

// Erdemir (puppeteer)
async function scrapeErdemir() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
   args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(
      "https://www.erdemir.com.tr/tedarikci-iliskileri/hurda-alim",
      { waitUntil: "networkidle2" }
    );
    const data = await page.evaluate(() => {
      let dateText = "";
      document.querySelectorAll("p").forEach((p) => {
        if (
          p.innerText.includes("Fiyatlar") &&
          p.innerText.includes("tarihinden")
        ) {
          dateText = p.innerText.trim();
        }
      });
      const table = document.querySelector("table.table.table-zebra");
      const prices = [];
      if (table) {
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          let material = cells[0] ? cells[0].innerText.trim() : "";
          let eskiPriceRaw = cells[1]
            ? cells[1].innerText.replace(/\s/g, "")
            : "";
          let yeniPriceRaw = cells[2]
            ? cells[2].innerText.replace(/\s/g, "")
            : "";
          let eskiMatch = eskiPriceRaw.match(/(\d+[\.,]?\d*)/);
          let yeniMatch = yeniPriceRaw.match(/(\d+[\.,]?\d*)/);
          const new_price = yeniMatch ? yeniMatch[1].replace(",", ".") : null;
          prices.push({ material, new_price });
        });
      }
      return { date: dateText, prices };
    });
    await browser.close();
    const mapped = mapErdemir(data.prices);
    const doc = createPriceDocument("Erdemir", mapped);
    fs.writeFileSync(
      `${exportFolder}/erdemir_db.json`,
      JSON.stringify(doc, null, 2),
      "utf-8"
    );
    // MongoDB'ye yeni kayıt olarak ekle
    await Price.create(doc);
    console.log("Erdemir verisi MongoDB'ye kaydedildi.");
  } catch (error) {
    console.error("Erdemir Hatası:", error);
    await browser.close();
  }
}

// Asil Çelik (puppeteer)
async function scrapeAsilCelik() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
   args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://asilcelik.com.tr/tedarikci-iliskileri", {
      waitUntil: "networkidle2",
    });
    const data = await page.evaluate(() => {
      const table = document.querySelector("table");
      const prices = [];
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const material = cells[0].innerText.trim();
        const priceText = cells[1].innerText;
        const priceMatch = priceText.match(/(\d+)/);
        const price = priceMatch ? priceMatch[1] : null;
        prices.push({ material, price });
      });
      const dateParagraph = document.querySelector(
        "div.column.is-three-fifths-fullhd p"
      );
      let dateText = "";
      if (dateParagraph) {
        dateText = dateParagraph.innerText.replace(/^- /, "").trim();
      }
      return { date: dateText, prices };
    });
    await browser.close();
    const mapped = mapAsilCelik(data.prices);
    const doc = createPriceDocument("Asil Çelik", mapped);
    fs.writeFileSync(
      `${exportFolder}/asilcelik_db.json`,
      JSON.stringify(doc, null, 2),
      "utf-8"
    );
    // MongoDB'ye yeni kayıt olarak ekle
    await Price.create(doc);
    console.log("Asil Çelik verisi MongoDB'ye kaydedildi.");
  } catch (error) {
    console.error("Asil Çelik Hatası:", error);
    await browser.close();
  }
}

// Kromancelik (puppeteer)
async function scrapeKromancelik() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
   args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://www.kromancelik.com.tr/hurda-tedarik.php", {
      waitUntil: "networkidle2",
    });
    const data = await page.evaluate(() => {
      const dateDiv = document.querySelector("div.tarih");
      const dateText = dateDiv ? dateDiv.innerText.trim() : "";
      const table = document.querySelector("section#hurda table");
      const prices = [];
      if (table) {
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        for (let i = 0; i < rows.length; i += 2) {
          const headerRow = rows[i];
          const valueRow = rows[i + 1];
          if (!headerRow || !valueRow) break;
          const headerCells = Array.from(headerRow.querySelectorAll("td"));
          const valueCells = Array.from(valueRow.querySelectorAll("td"));
          for (
            let j = 0;
            j < headerCells.length && j < valueCells.length;
            j++
          ) {
            const material = headerCells[j].innerText.trim();
            let priceText = valueCells[j].innerText.trim();
            priceText = priceText.replace("TL", "").trim();
            const match = priceText.match(/(\d+[.,]?\d*)/);
            const price = match ? match[1].replace(",", ".") : null;
            prices.push({ material, price });
          }
        }
      }
      return { date: dateText, prices };
    });
    await browser.close();
    const mapped = mapKromancelik(data.prices);
    const doc = createPriceDocument("Kromancelik", mapped);
    fs.writeFileSync(
      `${exportFolder}kromancelik_db.json`,
      JSON.stringify(doc, null, 2),
      "utf-8"
    );
    // MongoDB'ye yeni kayıt olarak ekle
    await Price.create(doc);
    console.log("Kromancelik verisi MongoDB'ye kaydedildi.");
  } catch (error) {
    console.error("Kromancelik Hatası:", error);
    await browser.close();
  }
}

// ------------------------------
// Tüm işlemleri çalıştırma
// ------------------------------
export default async function runAll() {
  try {
    // MongoDB'ye bağlan
    await connectDB();

    await Promise.all([
      crawlKardemir(),
      fetchColakoglu(),
      scrapeErdemir(),
      scrapeAsilCelik(),
      scrapeKromancelik(),
      scrapeIsdemir(),
    ]);
    console.log(
      "Tüm veriler MongoDB şemasına uygun şekilde işlendi ve kaydedildi."
    );
  } catch (error) {
    console.error("Genel hata:", error);
  }
}


// runAll();
