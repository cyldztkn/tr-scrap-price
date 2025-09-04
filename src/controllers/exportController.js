import exportService from "../services/exportService.js";
import priceService from "../services/priceService.js";
import capitalize from "../utils/standardize.js";

const exportController = {
  /**
   * @swagger
   * /export/html:
   *   get:
   *     summary: Tüm şirketlerin en güncel fiyatlarını HTML formatında dışa aktarır.
   *     description: |
   *       Bu endpoint, tüm şirketlerin en güncel fiyatlarını HTML formatında döndürür.
   *       Fiyatlar belirtilen para biriminde gösterilir.
   *     tags: [Export]
   *     parameters:
   *       - in: query
   *         name: currency
   *         description: |
   *           İstenilen para birimi (varsayılan: TRY)
   *           - TRY: Türk Lirası
   *           - USD: Amerikan Doları
   *           - EUR: Euro
   *         schema:
   *           type: string
   *           enum: [TRY, USD, EUR]
   *           default: TRY
   *     responses:
   *       200:
   *         description: Başarılı istek. HTML formatında fiyat tablosu döner.
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   *             example: |
   *               <table>
   *                 <tr>
   *                   <th>Şirket</th>
   *                   <th>DKP</th>
   *                   <th>Ekstra</th>
   *                 </tr>
   *                 <tr>
   *                   <td>Şirket A</td>
   *                   <td>12000 TRY</td>
   *                   <td>11500 TRY</td>
   *                 </tr>
   *               </table>
   *       400:
   *         description: Geçersiz para birimi parametresi.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Geçersiz para birimi. Sadece TRY, USD veya EUR kullanılabilir."
   *       500:
   *         description: Sunucu hatası.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Fiyatlar alınırken bir hata oluştu."
   */

  async exportHTML(req, res, next) {
    try {
      const currency = req.query.currency?.toUpperCase() || "TRY";
      const html = await exportService.getLatestPricesHTML(currency);
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      next(error);
    }
  },

  async exportCSV(req, res, next) {
    try {
      res.send("CSV Dışa Aktarma, Yakında...");
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /prices/history/{company}/export/html:
   *   get:
   *     summary: Belirli şirketlerin belirtilen dönemdeki fiyat geçmişini HTML olarak dışa aktarır.
   *     tags: [Export]
   *     parameters:
   *       - in: path
   *         name: company
   *         required: true
   *         description: Tek bir şirket adı.
   *         schema:
   *           type: string
   *       - in: query
   *         name: period
   *         description: "Gün cinsinden dönem (örn: 30, 120). Varsayılan 30."
   *         schema:
   *           type: integer
   *       - in: query
   *         name: currency
   *         description: "İstenilen para birimi (varsayılan: TRY)"
   *         schema:
   *           type: string
   *           enum: [TRY, USD, EUR]
   *           default: TRY
   *       - in: query
   *         name: format
   *         description: Çıktı formatı (yalnızca html desteklenir)
   *         schema:
   *           type: string
   *           enum: [html]
   *           default: html
   *     responses:
   *       200:
   *         description: Başarılı istek. HTML formatında fiyat tablosu döner.
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   *             example: |
   *               <table>
   *                 <tr><th>Şirket</th><th>Tarih</th><th>DKP</th></tr>
   *                 <tr><td>Şirket A</td><td>01/01/2024</td><td>12000</td></tr>
   *               </table>
   *       500:
   *         description: Sunucu hatası.
   */
  async exportCompanyHistoryHTML(req, res, next) {
    try {
      const currency = req.query.currency?.toUpperCase() || "TRY";
      const pathCompany = req.params.company;
      if (!pathCompany) {
        return res.status(400).json({ error: "Şirket belirtilmelidir." });
      }

      const companies = [capitalize(pathCompany)];

      const periodParam = req.query.period;
      const parsedDays = parseInt(periodParam, 10);
      const days = Number.isFinite(parsedDays) && parsedDays > 0 ? parsedDays : 30;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (days - 1));

      const prices = await priceService.getHistoricalPricesForPeriod(
        companies,
        startDate,
        endDate,
        currency
      );
      const html = await exportService.getHistoricalPricesHTML(prices);
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      next(error);
    }
  },
};

export default exportController;
