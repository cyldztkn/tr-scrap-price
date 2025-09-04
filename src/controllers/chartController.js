const chartController = {
    /**
     * @swagger
     * /charts/trend/{company}:
     *   get:
     *     summary: Belirli bir şirketin zaman içindeki fiyat trendlerini grafik verisi olarak getirir
     *     description: Belirtilen şirketin belirli bir dönemdeki fiyat değişimlerini grafik oluşturmak için uygun formatta döndürür
     *     tags: [Charts]
     *     parameters:
     *       - $ref: '#/components/parameters/Company'
     *       - $ref: '#/components/parameters/Currency'
     *       - $ref: '#/components/parameters/Period'
     *     responses:
     *       200:
     *         description: Başarılı istek
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 company:
     *                   type: string
     *                   description: Şirket adı
     *                 currency:
     *                   type: string
     *                   description: Para birimi
     *                 labels:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: Tarih etiketleri
     *                 datasets:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       label:
     *                         type: string
     *                         description: Kategori adı
     *                       data:
     *                         type: array
     *                         items:
     *                           type: number
     *                         description: Fiyat verileri
     *             example:
     *               company: "Asil Çelik"
     *               currency: "TRY"
     *               labels: ["2024-01-01", "2024-01-02", "2024-01-03"]
     *               datasets:
     *                 - label: "DKP"
     *                   data: [12000, 12100, 12200]
     *                 - label: "Ekstra"
     *                   data: [11500, 11600, 11700]
     *       404:
     *         description: Şirket bulunamadı
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Sunucu hatası
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getTrendChartDataByCompany(req, res, next) {
        try {
            const companyName = req.params.company;
            // Şirket trend verilerini alma ve grafik için hazırlama mantığı
            res.json({ message: `Şirket Trend Grafiği Verileri: ${companyName}, Yakında...` }); // Örnek cevap
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /charts/category/{category}/comparison:
     *   get:
     *     summary: Belirli bir kategoride, şirketler arası fiyat karşılaştırmasını grafik verisi olarak getirir
     *     description: Belirtilen hurda kategorisinde tüm şirketlerin fiyat değişimlerini karşılaştırmalı grafik verisi olarak döndürür
     *     tags: [Charts]
     *     parameters:
     *       - $ref: '#/components/parameters/Category'
     *       - $ref: '#/components/parameters/Currency'
     *       - $ref: '#/components/parameters/Period'
     *     responses:
     *       200:
     *         description: Başarılı istek
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 category:
     *                   type: string
     *                   description: Hurda kategorisi
     *                 currency:
     *                   type: string
     *                   description: Para birimi
     *                 labels:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: Tarih etiketleri
     *                 datasets:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       label:
     *                         type: string
     *                         description: Şirket adı
     *                       data:
     *                         type: array
     *                         items:
     *                           type: number
     *                         description: Fiyat verileri
     *             example:
     *               category: "DKP"
     *               currency: "TRY"
     *               labels: ["2024-01-01", "2024-01-02", "2024-01-03"]
     *               datasets:
     *                 - label: "Asil Çelik"
     *                   data: [12000, 12100, 12200]
     *                 - label: "Çolakoğlu"
     *                   data: [12100, 12200, 12300]
     *       404:
     *         description: Kategori bulunamadı
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Sunucu hatası
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
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