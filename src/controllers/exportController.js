import exportService from "../services/exportService.js";

const exportController = {
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
