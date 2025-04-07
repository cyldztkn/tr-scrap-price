const chartController = {
    async getTrendChartDataByCompany(req, res, next) {
        try {
            const companyName = req.params.company;
            // Şirket trend verilerini alma ve grafik için hazırlama mantığı
            res.json({ message: `Şirket Trend Grafiği Verileri: ${companyName}, Yakında...` }); // Örnek cevap
        } catch (error) {
            next(error);
        }
    },

    async getCategoryComparisonChartData(req, res, next) {
        try {
            const category = req.params.category;
            // Kategori karşılaştırma verilerini alma ve grafik için hazırlama mantığı
            res.json({ message: `Kategori Karşılaştırma Grafiği Verileri: ${category}, Yakında...` }); // Örnek cevap
        } catch (error) {
            next(error);
        }
    },
};

export default chartController; 