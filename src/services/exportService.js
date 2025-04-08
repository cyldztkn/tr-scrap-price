import priceService from "./priceService.js";

const exportService = {
  async getLatestPricesHTML(currency = "TRY") {
    const prices = await priceService.getLatestPrices(currency);
    return generateHTMLTable(prices);
  },
};

function generateHTMLTable(prices) {
  let html = `
    <table>
      <thead>
        <tr>
          <th>Şirket</th>
          <th>DKP</th>
          <th>Ekstra</th>
          <th>Grup1</th>
          <th>Grup2</th>
          <th>Talas</th>
          <th>Para Birimi</th>
          <th>Güncelleme Tarihi</th>
        </tr>
      </thead>
      <tbody>
  `;

  prices.forEach((priceData) => {
    html += `
      <tr>
        <td>${priceData.company}</td>
        <td>${priceData.prices.DKP}</td>
        <td>${priceData.prices.Ekstra}</td>
        <td>${priceData.prices.Grup1}</td>
        <td>${priceData.prices.Grup2}</td>
        <td>${priceData.prices.Talas}</td>
        <td>${priceData.currency}</td>
        <td>${new Date(priceData.updateDate).toLocaleDateString()}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

export default exportService;
