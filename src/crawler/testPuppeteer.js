import puppeteer from "puppeteer";

export default async function TesrPuppeterr() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-zygote",
        "--disable-software-rasterizer",
        "--single-process",
      ],
    });
    const page = await browser.newPage();
    await page.goto("https://example.com");
    const title = await page.title();
    console.log("🎉 Puppeteer başardı:", title);
    await browser.close();
  } catch (error) {
    console.error("❌ Puppeteer hatası:", error);
  }
}
