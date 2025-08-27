import priceService from "../services/priceService.js";
import capitalize from "../utils/capitalize.js";

/**
 * @swagger
 * /prices/latest:
 *   get:
 *     summary: Tüm şirketlerin en güncel fiyatlarını getirir.
 *     tags: [Prices]
 *     parameters:
 *       - in: query
 *         name: currency
 *         description: |
 *           İstenilen para birimi (varsayılan: TRY)
 *         schema:
 *           type: string
 *           enum: [TRY, USD, EUR]
 *     responses:
 *       200:
 *         description: Başarılı istek.
 *         content:
 *           application/json:
 *             example:
 *               - company: "Şirket A"
 *                 prices:
 *                   DKP: 12000
 *                   Ekstra: 11500
 *                 currency: "TRY"
 *       500:
 *         description: Sunucu hatası.
 */
const priceController = {
  async getLatestPrices(req, res, next) {
    try {
      const currency = req.query.currency?.toUpperCase() || "TRY";
      const prices = await priceService.getLatestPrices(currency);
      res.json(prices);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /prices/latest/{company}:
   *   get:
   *     summary: Belirli bir şirketin en güncel fiyatını getirir.
   *     tags: [Prices]
   *     parameters:
   *       - in: path
   *         name: company
   *         required: true
   *         description: Şirket adı
   *         schema:
   *           type: string
   *       - in: query
   *         name: currency
   *         description: |
   *           İstenilen para birimi (varsayılan: TRY)
   *         schema:
   *           type: string
   *           enum: [TRY, USD, EUR]
   *     responses:
   *       200:
   *         description: Başarılı istek.
   *         content:
   *           application/json:
   *             example:
   *               company: "Şirket A"
   *               prices:
   *                 DKP: 12000
   *                 Ekstra: 11500
   *               currency: "TRY"
   *       404:
   *         description: Şirket bulunamadı.
   *       500:
   *         description: Sunucu hatası.
   */
  async getLatestPriceByCompany(req, res, next) {
    try {
      const companyName = req.params.company;
      const currency = req.query.currency?.toUpperCase() || "TRY";
      const price = await priceService.getLatestPriceByCompany(
        capitalize(companyName),
        currency
      );
      if (price) {
        res.json(price);
      } else {
        res.status(404).json({ message: "Şirket fiyatı bulunamadı" });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /prices/history/{company}:
   *   get:
   *     summary: Belirli bir şirketin fiyat geçmişini getirir.
   *     tags: [Prices]
   *     parameters:
   *       - in: path
   *         name: company
   *         required: true
   *         description: Şirket adı
   *         schema:
   *           type: string
   *       - in: query
   *         name: currency
   *         description: |
   *           İstenilen para birimi (varsayılan: TRY)
   *         schema:
   *           type: string
   *           enum: [TRY, USD, EUR]
   *     responses:
   *       200:
   *         description: Başarılı istek.
   *         content:
   *           application/json:
   *             example:
   *               company: "Şirket A"
   *               history:
   *                 - date: "2024-01-01"
   *                   prices:
   *                     DKP: 11000
   *                     Ekstra: 10500
   *                 - date: "2024-01-02"
   *                   prices:
   *                     DKP: 11200
   *                     Ekstra: 10700
   *               currency: "TRY"
   *       500:
   *         description: Sunucu hatası.
   */
  async getHistoricalPricesByCompany(req, res, next) {
    try {
      const companyName = req.params.company;
      const currency = req.query.currency?.toUpperCase() || "TRY";
      const history = await priceService.getHistoricalPricesByCompany(
        capitalize(companyName),
        currency
      );
      res.json(history);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /prices/category/{category}:
   *   get:
   *     summary: Belirli bir kategori için fiyat analizi getirir.
   *     tags: [Prices]
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         description: Fiyat kategorisi (DKP, Ekstra, Grup1, Grup2, Talas)
   *         schema:
   *           type: string
   *           enum: [DKP, Ekstra, Grup1, Grup2, Talas]
   *       - in: query
   *         name: currency
   *         description: |
   *           İstenilen para birimi (varsayılan: TRY)
   *         schema:
   *           type: string
   *           enum: [TRY, USD, EUR]
   *     responses:
   *       200:
   *         description: Başarılı istek.
   *         content:
   *           application/json:
   *             example:
   *               category: "DKP"
   *               analysis:
   *                 - company: "Şirket A"
   *                   price: 12000
   *                 - company: "Şirket B"
   *                   price: 12100
   *               currency: "TRY"
   *       500:
   *         description: Sunucu hatası.
   */
  async getCategoryPriceAnalysis(req, res, next) {
    try {
      const category = req.params.category.toUpperCase();
      const currency = req.query.currency?.toUpperCase() || "TRY";
      const analysis = await priceService.getCategoryPriceAnalysis(
        category,
        currency
      );
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  },
};

export default priceController;
