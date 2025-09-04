import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Türkiye Hurda Fiyatları API",
      version: "1.0.0",
      description: "Türkiye'deki demir-çelik fabrikalarından alınan hurda fiyatlarını ve döviz kuru bilgilerini sağlayan RESTful API",
      contact: {
        name: "Çağkan Yildiztekin",
        email: "cagkan.yildiztekin@example.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "https://tr-scrap-price.onrender.com/api/v1",
        description: "Production server"
      },
      {
        url: "http://127.0.0.1:3000/api/v1",
        description: "Development server"
      },
    ],
    components: {
      schemas: {
        Price: {
          type: "object",
          properties: {
            company: {
              type: "string",
              description: "Şirket adı"
            },
            updateDate: {
              type: "string",
              format: "date-time",
              description: "Fiyat güncelleme tarihi"
            },
            fetchDate: {
              type: "string",
              format: "date-time",
              description: "Veri çekme tarihi"
            },
            prices: {
              type: "object",
              properties: {
                DKP: {
                  type: "number",
                  description: "DKP hurda fiyatı"
                },
                Ekstra: {
                  type: "number",
                  description: "Ekstra hurda fiyatı"
                },
                Grup1: {
                  type: "number",
                  description: "Grup1 hurda fiyatı"
                },
                Grup2: {
                  type: "number",
                  description: "Grup2 hurda fiyatı"
                },
                Talas: {
                  type: "number",
                  description: "Talas hurda fiyatı"
                }
              }
            },
            exchangeRates: {
              type: "object",
              properties: {
                USD: {
                  type: "number",
                  description: "USD kuru"
                },
                EUR: {
                  type: "number",
                  description: "EUR kuru"
                }
              }
            }
          }
        },
        Company: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Şirket ID'si"
            },
            name: {
              type: "string",
              description: "Şirket adı"
            },
            lastUpdate: {
              type: "string",
              format: "date-time",
              description: "Son güncelleme tarihi"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Hata mesajı"
            },
            message: {
              type: "string",
              description: "Hata açıklaması"
            }
          }
        }
      },
      parameters: {
        Currency: {
          name: "currency",
          in: "query",
          description: "Para birimi",
          required: false,
          schema: {
            type: "string",
            enum: ["TRY", "USD", "EUR"],
            default: "TRY"
          }
        },
        Company: {
          name: "company",
          in: "path",
          description: "Şirket adı",
          required: true,
          schema: {
            type: "string"
          }
        },
        Category: {
          name: "category",
          in: "path",
          description: "Hurda kategorisi",
          required: true,
          schema: {
            type: "string",
            enum: ["DKP", "Ekstra", "Grup1", "Grup2", "Talas"]
          }
        },
        Period: {
          name: "period",
          in: "query",
          description: "Gün cinsinden dönem",
          required: false,
          schema: {
            type: "integer",
            default: 30
          }
        }
      }
    },
    tags: [
      {
        name: "Prices",
        description: "Fiyat verileri ile ilgili işlemler"
      },
      {
        name: "Export",
        description: "Veri dışa aktarma işlemleri"
      },
      {
        name: "Meta",
        description: "Meta veri ve istatistikler"
      },
      {
        name: "Charts",
        description: "Grafik verileri (geliştirme aşamasında)"
      }
    ]
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // Rota ve kontrolcü dosyalarının yolu
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
