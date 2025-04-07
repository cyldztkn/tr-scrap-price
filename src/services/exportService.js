import priceService from "./priceService.js";

const exportService = {
  async getLatestPricesHTML(currency = "TRY") {
    const prices = await priceService.getLatestPrices(currency);
    return generateHTMLTable(prices);
  },
};

function generateHTMLTable(prices) {
  let html = `
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
      <thead>
        <tr>
          <th style="border: 1px solid #000; padding: 8px;">Şirket</th>
          <th style="border: 1px solid #000; padding: 8px;">DKP</th>
          <th style="border: 1px solid #000; padding: 8px;">Ekstra</th>
          <th style="border: 1px solid #000; padding: 8px;">Grup1</th>
          <th style="border: 1px solid #000; padding: 8px;">Grup2</th>
          <th style="border: 1px solid #000; padding: 8px;">Talas</th>
          <th style="border: 1px solid #000; padding: 8px;">Para Birimi</th>
          <th style="border: 1px solid #000; padding: 8px;">Güncelleme Tarihi</th>
        </tr>
      </thead>
      <tbody>
  `;

  prices.forEach((priceData) => {
    html += `
      <tr>
        <td style="border: 1px solid #000; padding: 8px;">${
          priceData.company
        }</td>
        <td style="border: 1px solid #000; padding: 8px;">${
          priceData.prices.DKP
        }</td>
        <td style="border: 1px solid #000; padding: 8px;">${
          priceData.prices.Ekstra
        }</td>
        <td style="border: 1px solid #000; padding: 8px;">${
          priceData.prices.Grup1
        }</td>
        <td style="border: 1px solid #000; padding: 8px;">${
          priceData.prices.Grup2
        }</td>
        <td style="border: 1px solid #000; padding: 8px;">${
          priceData.prices.Talas
        }</td>
        <td style="border: 1px solid #000; padding: 8px;">${
          priceData.currency
        }</td>
        <td style="border: 1px solid #000; padding: 8px;">${new Date(
          priceData.updateDate
        ).toLocaleDateString()}</td>
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
