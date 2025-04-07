import mongoose from "mongoose";
import config from "../config/config.js";
import Company from "../models/Company.js";
import Price from "../models/Price.js";

const dummyCompanies = [
  { name: "Şirket A", url: "http://sirketa.com" },
  { name: "Şirket B", url: "http://sirketb.com" },
  { name: "Şirket C", url: "http://sirketc.com" },
  { name: "Şirket D", url: "http://sirketd.com" },
  { name: "Şirket E", url: "http://sirkete.com" },
];
// DummyData
// DummyData
// DummyData
// DummyData
// DummyData

const dummyPrices = [
  // Şirket A
  {
    company: "Şirket A",
    updateDate: new Date("2024-01-20"),
    fetchDate: new Date("2024-01-20"),
    prices: {
      DKP: 12000,
      Ekstra: 11500,
      Grup1: 11000,
      Grup2: 10500,
      Talas: 9000,
    },
    exchangeRates: { USD: 30.1, EUR: 32.5 },
  },
  {
    company: "Şirket A",
    updateDate: new Date("2024-03-01"),
    fetchDate: new Date("2024-03-01"),
    prices: {
      DKP: 12250,
      Ekstra: 11750,
      Grup1: 11250,
      Grup2: 10750,
      Talas: 9200,
    },
    exchangeRates: { USD: 30.5, EUR: 32.8 },
  },
  {
    company: "Şirket A",
    updateDate: new Date("2024-06-15"),
    fetchDate: new Date("2024-06-15"),
    prices: {
      DKP: 12500,
      Ekstra: 12000,
      Grup1: 11500,
      Grup2: 11000,
      Talas: 9400,
    },
    exchangeRates: { USD: 31.0, EUR: 33.1 },
  },
  {
    company: "Şirket A",
    updateDate: new Date("2024-10-10"),
    fetchDate: new Date("2024-10-10"),
    prices: {
      DKP: 12750,
      Ekstra: 12250,
      Grup1: 11750,
      Grup2: 11250,
      Talas: 9600,
    },
    exchangeRates: { USD: 31.5, EUR: 33.4 },
  },

  // Şirket B
  {
    company: "Şirket B",
    updateDate: new Date("2024-01-21"),
    fetchDate: new Date("2024-01-21"),
    prices: {
      DKP: 12100,
      Ekstra: 11600,
      Grup1: 11100,
      Grup2: 10600,
      Talas: 9100,
    },
    exchangeRates: { USD: 30.15, EUR: 32.55 },
  },
  {
    company: "Şirket B",
    updateDate: new Date("2024-03-02"),
    fetchDate: new Date("2024-03-02"),
    prices: {
      DKP: 12350,
      Ekstra: 11850,
      Grup1: 11350,
      Grup2: 10850,
      Talas: 9300,
    },
    exchangeRates: { USD: 30.55, EUR: 32.85 },
  },
  {
    company: "Şirket B",
    updateDate: new Date("2024-06-16"),
    fetchDate: new Date("2024-06-16"),
    prices: {
      DKP: 12600,
      Ekstra: 12100,
      Grup1: 11600,
      Grup2: 11100,
      Talas: 9500,
    },
    exchangeRates: { USD: 31.05, EUR: 33.15 },
  },
  {
    company: "Şirket B",
    updateDate: new Date("2024-10-11"),
    fetchDate: new Date("2024-10-11"),
    prices: {
      DKP: 12850,
      Ekstra: 12350,
      Grup1: 11850,
      Grup2: 11350,
      Talas: 9700,
    },
    exchangeRates: { USD: 31.55, EUR: 33.45 },
  },

  // Şirket C
  {
    company: "Şirket C",
    updateDate: new Date("2024-01-22"),
    fetchDate: new Date("2024-01-22"),
    prices: {
      DKP: 12200,
      Ekstra: 11700,
      Grup1: 11200,
      Grup2: 10700,
      Talas: 9200,
    },
    exchangeRates: { USD: 30.2, EUR: 32.6 },
  },
  {
    company: "Şirket C",
    updateDate: new Date("2024-03-03"),
    fetchDate: new Date("2024-03-03"),
    prices: {
      DKP: 12450,
      Ekstra: 11950,
      Grup1: 11450,
      Grup2: 10950,
      Talas: 9400,
    },
    exchangeRates: { USD: 30.6, EUR: 32.9 },
  },
  {
    company: "Şirket C",
    updateDate: new Date("2024-06-17"),
    fetchDate: new Date("2024-06-17"),
    prices: {
      DKP: 12700,
      Ekstra: 12200,
      Grup1: 11700,
      Grup2: 11200,
      Talas: 9600,
    },
    exchangeRates: { USD: 31.1, EUR: 33.2 },
  },
  {
    company: "Şirket C",
    updateDate: new Date("2024-10-12"),
    fetchDate: new Date("2024-10-12"),
    prices: {
      DKP: 12950,
      Ekstra: 12450,
      Grup1: 11950,
      Grup2: 11450,
      Talas: 9800,
    },
    exchangeRates: { USD: 31.6, EUR: 33.5 },
  },

  // Şirket D
  {
    company: "Şirket D",
    updateDate: new Date("2024-01-23"),
    fetchDate: new Date("2024-01-23"),
    prices: {
      DKP: 12300,
      Ekstra: 11800,
      Grup1: 11300,
      Grup2: 10800,
      Talas: 9300,
    },
    exchangeRates: { USD: 30.25, EUR: 32.65 },
  },
  {
    company: "Şirket D",
    updateDate: new Date("2024-03-04"),
    fetchDate: new Date("2024-03-04"),
    prices: {
      DKP: 12550,
      Ekstra: 12050,
      Grup1: 11550,
      Grup2: 11050,
      Talas: 9500,
    },
    exchangeRates: { USD: 30.65, EUR: 32.95 },
  },
  {
    company: "Şirket D",
    updateDate: new Date("2024-06-18"),
    fetchDate: new Date("2024-06-18"),
    prices: {
      DKP: 12800,
      Ekstra: 12300,
      Grup1: 11800,
      Grup2: 11300,
      Talas: 9700,
    },
    exchangeRates: { USD: 31.15, EUR: 33.25 },
  },
  {
    company: "Şirket D",
    updateDate: new Date("2024-10-13"),
    fetchDate: new Date("2024-10-13"),
    prices: {
      DKP: 13050,
      Ekstra: 12550,
      Grup1: 12050,
      Grup2: 11550,
      Talas: 9900,
    },
    exchangeRates: { USD: 31.65, EUR: 33.55 },
  },

  // Şirket E
  {
    company: "Şirket E",
    updateDate: new Date("2024-01-24"),
    fetchDate: new Date("2024-01-24"),
    prices: {
      DKP: 12400,
      Ekstra: 11900,
      Grup1: 11400,
      Grup2: 10900,
      Talas: 9400,
    },
    exchangeRates: { USD: 30.3, EUR: 32.7 },
  },
  {
    company: "Şirket E",
    updateDate: new Date("2024-03-05"),
    fetchDate: new Date("2024-03-05"),
    prices: {
      DKP: 12650,
      Ekstra: 12150,
      Grup1: 11650,
      Grup2: 11150,
      Talas: 9600,
    },
    exchangeRates: { USD: 30.7, EUR: 33.0 },
  },
  {
    company: "Şirket E",
    updateDate: new Date("2024-06-19"),
    fetchDate: new Date("2024-06-19"),
    prices: {
      DKP: 12900,
      Ekstra: 12400,
      Grup1: 11900,
      Grup2: 11400,
      Talas: 9800,
    },
    exchangeRates: { USD: 31.2, EUR: 33.3 },
  },
  {
    company: "Şirket E",
    updateDate: new Date("2024-10-14"),
    fetchDate: new Date("2024-10-14"),
    prices: {
      DKP: 13150,
      Ekstra: 12650,
      Grup1: 12150,
      Grup2: 11650,
      Talas: 10000,
    },
    exchangeRates: { USD: 31.7, EUR: 33.6 },
  },
];

const seedDummyData = async () => {
  try {
    await mongoose.connect(config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding...");

    await Company.deleteMany({});
    console.log("Companies collection cleared.");
    await Company.insertMany(dummyCompanies);
    console.log("Dummy companies seeded.");

    await Price.deleteMany({});
    console.log("Prices collection cleared.");
    await Price.insertMany(dummyPrices);
    console.log("Dummy prices seeded.");

    console.log("Dummy data seeding completed!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Dummy data seeding failed:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "seed") {
  seedDummyData();
}
