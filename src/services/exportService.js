import priceService from "./priceService.js";

const exportService = {
  async getLatestPricesHTML(currency = "TRY") {
    const prices = await priceService.getLatestPrices(currency);
    return generateHTMLTable(prices);
  },

  async getHistoricalPricesHTML(pricesByCompany) {
    return generateHistoricalHTMLTable(pricesByCompany);
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

  prices.sort((a, b) => a.company.localeCompare(b.company)).forEach((priceData) => {
    html += `
      <tr>
        <td>${priceData.company ? priceData.company : "-"}</td>
        <td>${priceData.prices.DKP ? priceData.prices.DKP : "-"}</td>
        <td>${priceData.prices.Ekstra ? priceData.prices.Ekstra : "-"}</td>
        <td>${priceData.prices.Grup1 ? priceData.prices.Grup1 : "-"}</td>
        <td>${priceData.prices.Grup2 ? priceData.prices.Grup2 : "-"}</td>
        <td>${priceData.prices.Talas ? priceData.prices.Talas : "-"}</td>
        <td>${priceData.currency ? priceData.currency : "-"}</td>
        <td>${
          priceData.updateDate
            ? new Date(priceData.updateDate).toLocaleDateString()
            : "-"
        }</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

function generateHistoricalHTMLTable(pricesByCompany) {
  let html = `
    <table>
      <thead>
        <tr>
          <th>Şirket</th>
          <th>Tarih</th>
          <th>DKP</th>
          <th>Ekstra</th>
          <th>Grup1</th>
          <th>Grup2</th>
          <th>Talas</th>
          <th>Para Birimi</th>
        </tr>
      </thead>
      <tbody>
  `;

  Object.keys(pricesByCompany)
    .sort((a, b) => a.localeCompare(b))
    .forEach((company) => {
      pricesByCompany[company]
        .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))
        .forEach((priceData) => {
          html += `
            <tr>
              <td>${company}</td>
              <td>${
                priceData.updateDate
                  ? new Date(priceData.updateDate).toLocaleDateString()
                  : "-"
              }</td>
              <td>${priceData.prices.DKP ?? "-"}</td>
              <td>${priceData.prices.Ekstra ?? "-"}</td>
              <td>${priceData.prices.Grup1 ?? "-"}</td>
              <td>${priceData.prices.Grup2 ?? "-"}</td>
              <td>${priceData.prices.Talas ?? "-"}</td>
              <td>${priceData.currency ?? "-"}</td>
            </tr>
          `;
        });
    });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

export default exportService;
