import priceService from '../services/priceService.js';

const metaController = {
    async getCompanies(req, res, next) {
        try {
            const companies = await priceService.getCompanies();
            res.json(companies);
        } catch (error) {
            next(error);
        }
    },

    async getStats(req, res, next) {
        try {
            // İstatistik verilerini burada hesapla veya servisten al
            const stats = {
                totalCompanies: 5, // Örnek veri
                totalPriceRecords: 100, // Örnek veri
                lastUpdated: new Date(), // Örnek veri
            };
            res.json(stats);
        } catch (error) {
            next(error);
        }
    },
};

export default metaController; 