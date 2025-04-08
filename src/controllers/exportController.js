import exportService from "../services/exportService.js";

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
};

export default exportController;
