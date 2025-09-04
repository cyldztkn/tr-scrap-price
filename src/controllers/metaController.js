import priceService from "../services/priceService.js";

const metaController = {
  /**
   * @swagger
   * /meta/companies:
   *   get:
   *     summary: Sistemdeki tüm şirketlerin listesini getirir
   *     description: API'de bulunan tüm şirketlerin listesini ve son güncelleme tarihlerini döndürür
   *     tags: [Meta]
   *     responses:
   *       200:
   *         description: Başarılı istek
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 companies:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Company'
   *             example:
   *               companies:
   *                 - id: "asil-celik"
   *                   name: "Asil Çelik"
   *                   lastUpdate: "2024-01-15T10:30:00Z"
   *                 - id: "colakoglu"
   *                   name: "Çolakoğlu"
   *                   lastUpdate: "2024-01-15T11:00:00Z"
   *       500:
   *         description: Sunucu hatası
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getCompanies(req, res, next) {
    try {
      const companies = await priceService.getCompanies();
      res.json(companies);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /meta/stats:
   *   get:
   *     summary: API kullanım istatistiklerini getirir
   *     description: Sistemdeki toplam şirket sayısı, fiyat kayıt sayısı ve son güncelleme tarihi gibi istatistikleri döndürür
   *     tags: [Meta]
   *     responses:
   *       200:
   *         description: Başarılı istek
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalCompanies:
   *                   type: integer
   *                   description: Toplam şirket sayısı
   *                 totalPriceRecords:
   *                   type: integer
   *                   description: Toplam fiyat kayıt sayısı
   *                 lastUpdated:
   *                   type: string
   *                   format: date-time
   *                   description: Son güncelleme tarihi
   *             example:
   *               totalCompanies: 5
   *               totalPriceRecords: 1250
   *               lastUpdated: "2024-01-15T12:00:00Z"
   *       500:
   *         description: Sunucu hatası
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getStats(req, res, next) {
    try {
      // İstatistik verilerini burada hesapla veya servisten al
      const stats = {
        note: "This is a dummy data",
        totalCompanies: 6,
        totalPriceRecords: 100, 
        lastUpdated: new Date(), 
      };
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },
};

export default metaController;
