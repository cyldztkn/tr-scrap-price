import Price from "../models/Price.js";
import Company from "../models/Company.js";
import convertCurrency from "../utils/currencyConverter.js";

const priceService = {
  async getLatestPrices(currency = "TRY") {
    const latestPrices = await Price.find().sort({ updateDate: -1 }).limit(6); // En son 5 fiyat kaydını getir (varsayılan olarak 5 şirket olduğunu varsayalım)
    // Promise.all ile tüm dönüşümleri bekle
    const convertedPrices = await Promise.all(
      latestPrices.map(async (priceDoc) => {
        return this.convertPriceCurrency(priceDoc.toObject(), currency);
      })
    );
    return convertedPrices;
  },

  async getLatestPriceByCompany(companyName, currency = "TRY") {
    const latestPrice = await Price.findOne({ company: companyName }).sort({
      updateDate: -1,
    });
    return latestPrice
      ? this.convertPriceCurrency(latestPrice.toObject(), currency)
      : null;
  },

  async getHistoricalPricesByCompany(companyName, currency = "TRY") {
    const historicalPrices = await Price.find({ company: companyName }).sort({
      updateDate: -1,
    });
    // Promise.all ile tüm dönüşümleri bekle
    const convertedPrices = await Promise.all(
      historicalPrices.map(async (priceDoc) => {
        return await this.convertPriceCurrency(priceDoc.toObject(), currency);
      })
    );
    return convertedPrices;
  },

  async getCategoryPriceAnalysis(category, currency = "TRY") {
    const allPrices = await Price.find().sort({ updateDate: -1 });
    const categoryPrices = allPrices.map((priceDoc) => ({
      company: priceDoc.company,
      date: priceDoc.updateDate,
      price: priceDoc.prices[category],
      currency: "TRY", // Veritabanında TRY olarak saklandığını varsayalım
    }));
    return categoryPrices.map((priceData) => ({
      ...priceData,
      price: convertCurrency(
        priceData.price,
        "TRY",
        currency,
        priceData.exchangeRates
      ),
      currency: currency,
    }));
  },

  async getCompanies() {
    return await Company.find({ active: true });
  },

  async convertPriceCurrency(priceDoc, targetCurrency) {
    if (!priceDoc) return null;
    if (!priceDoc.exchangeRates) return priceDoc; // Döviz kurları yoksa çevirme yapma

    const convertedPrices = {};
    for (const category in priceDoc.prices) {
      convertedPrices[category] = convertCurrency(
        priceDoc.prices[category],
        "TRY", // Veritabanında TRY olarak saklandığını varsayalım
        targetCurrency,
        priceDoc.exchangeRates
      );
    }

    return {
      ...priceDoc,
      prices: convertedPrices,
      currency: targetCurrency,
    };
  },
};

export default priceService;
  