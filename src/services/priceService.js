import Price from "../models/Price.js";
import Company from "../models/Company.js";
import convertCurrency from "../utils/currencyConverter.js";

const priceService = {
  async getLatestPrices(currency = "TRY") {
    // All companies list
    const companies = [
      "Kardemir",
      "Isdemir",
      "Colakoglu",
      "Erdemir",
      "Asil Çelik",
      "Kromancelik"
    ];

    // For each company, get the latest price record
    const latestPrices = await Promise.all(
      companies.map(async (company) => {
        const latestPrice = await Price.findOne({ company })
          .sort({ updateDate: -1 })
          .limit(1);
        return latestPrice;
      })
    );

    // Filter out null results and apply currency conversion
    const convertedPrices = await Promise.all(
      latestPrices
        .filter(price => price !== null)
        .map(async (priceDoc) => {
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
    // Wait for all conversions
    const convertedPrices = await Promise.all(
      historicalPrices.map(async (priceDoc) => {
        return await this.convertPriceCurrency(priceDoc.toObject(), currency);
      })
    );
    return convertedPrices;
  },

  async getHistoricalPricesForPeriod(
    companies,
    startDate,
    endDate,
    currency = "TRY"
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const results = {};
    await Promise.all(
      companies.map(async (company) => {
        const prices = await Price.find({
          company,
          updateDate: { $gte: start, $lt: end },
        }).sort({ updateDate: -1 });

        const converted = await Promise.all(
          prices.map((priceDoc) =>
            this.convertPriceCurrency(priceDoc.toObject(), currency)
          )
        );
        results[company] = converted;
      })
    );

    return results;
  },

  async getCategoryPriceAnalysis(category, currency = "TRY") {
    const allPrices = await Price.find().sort({ updateDate: -1 });
    const categoryPrices = allPrices.map((priceDoc) => ({
      company: priceDoc.company,
      date: priceDoc.updateDate,
      price: priceDoc.prices[category],
      currency: "TRY", 
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
        "TRY", 
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
