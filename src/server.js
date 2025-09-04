import app from "./app.js";
import config from "./config/config.js";
import mongoose from "mongoose";
import cron from "node-cron";
import runAll from "./crawler/priceCrawler.js";

// import connectDB from './config/db.js';
async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("MongoDB bağlantısı başarılı");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    process.exit(1);
  }
}

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Server başlatılırken hata:", error);
  }
};

cron.schedule("0 7 * * *", async () => {
  console.log("⏰ Cron job: 06:00’da runAll() başlıyor...");
  await runAll();
});

startServer();
