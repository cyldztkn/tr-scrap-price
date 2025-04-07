# Hurda Fiyatları API - Kullanıcı Dökümantasyonu

Bu API, Türkiye'deki demir-çelik fabrikalarından alınan hurda fiyatlarını ve döviz kuru bilgilerini sağlayan bir RESTful API'dir. API'yi kullanarak en güncel fiyatları, tarihsel verileri, fiyat karşılaştırmalarını ve grafik analizlerini elde edebilirsiniz.

>[!Note]
>Swagger Docs => www.x.com


## API Temel Bilgileri

- **Base URL**: `https://your-render-app-url.com/api/v1`
- **Format**: JSON ve HTML (bazı endpoint'lerde)
- **Auth**: API anahtarı gereksizdir, herkes erişebilir.

---
## Endpointler

### Güncel Fiyatlar


`GET /api/v1/prices/latest`

- **Açıklama**: Tüm şirketlerin en güncel hurda fiyatlarını döndürür
- **Parametreler**:
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
    - `category` (opsiyonel): Belirli bir kategori (DKP, Ekstra, Grup1, Grup2, Talas)
- **Örnek Yanıt**:
```JSON
{
  "timestamp": "2025-04-07T12:00:00Z",
  "currency": "TRY",
  "prices": [
    {
      "company": "Asil Çelik",
      "updateDate": "2025-03-22T00:00:00Z",
      "prices": {
        "DKP": 15000,
        "Ekstra": 14500,
        "Grup1": 14000,
        "Grup2": 13500,
        "Talas": 13000
      }
    },
    {
      "company": "Çolakoğlu",
      "updateDate": "2025-03-23T00:00:00Z",
      "prices": {
        "DKP": 15200,
        "Ekstra": 14700,
        "Grup1": 14200,
        "Grup2": 13700,
        "Talas": 13200
      }
    }
  ]
}
```

### Belirli Şirketin Güncel Fiyatları



`GET /api/v1/prices/latest/:company`

- **Açıklama**: Belirtilen şirketin en güncel hurda fiyatlarını döndürür
- **Parametreler**:
    - `company`: Şirket adı (URL-encoded)
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Örnek Yanıt**:
```JSON
{
  "company": "Asil Çelik",
  "updateDate": "2025-03-22T00:00:00Z",
  "fetchDate": "2025-04-07T12:00:00Z",
  "currency": "TRY",
  "prices": {
    "DKP": 15000,
    "Ekstra": 14500,
    "Grup1": 14000,
    "Grup2": 13500,
    "Talas": 13000
  }
}
```

### Tarihsel Fiyat Verileri

`GET /api/v1/prices/history/:company`

- **Açıklama**: Belirtilen şirketin tarihsel fiyat verilerini döndürür
- **Parametreler**:
    - `company`: Şirket adı (URL-encoded)
    - `startDate` (opsiyonel): Başlangıç tarihi (YYYY-MM-DD)
    - `endDate` (opsiyonel): Bitiş tarihi (YYYY-MM-DD), varsayılan: bugün
    - `interval` (opsiyonel): Veri aralığı (daily, weekly, monthly), varsayılan: daily
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
    - `category` (opsiyonel): Hurda kategorisi (DKP, Ekstra, Grup1, Grup2, Talas)
- **Örnek Yanıt**:

```JSON
{
  "company": "Asil Çelik",
  "currency": "TRY",
  "category": "DKP",
  "interval": "daily",
  "data": [
    {
      "date": "2025-03-01T00:00:00Z",
      "price": 14800
    },
    {
      "date": "2025-03-15T00:00:00Z",
      "price": 14900
    },
    {
      "date": "2025-03-22T00:00:00Z",
      "price": 15000
    }
  ]
}
```

### Karşılaştırmalı Fiyat Tablosu

`GET /api/v1/prices/comparison`

- **Açıklama**: Tüm şirketlerin en güncel fiyatlarını karşılaştırmalı tablo formatında döndürür
- **Parametreler**:
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
    - `format` (opsiyonel): Yanıt formatı (json, html), varsayılan: json
- **Örnek Yanıt (JSON)**:

```JSON
{
  "timestamp": "2025-04-07T12:00:00Z",
  "currency": "TRY",
  "categories": ["DKP", "Ekstra", "Grup1", "Grup2", "Talas"],
  "companies": [
    {
      "name": "Asil Çelik",
      "updateDate": "2025-03-22T00:00:00Z",
      "prices": [15000, 14500, 14000, 13500, 13000]
    },
    {
      "name": "Çolakoğlu",
      "updateDate": "2025-03-23T00:00:00Z",
      "prices": [15200, 14700, 14200, 13700, 13200]
    }
  ]
}
```

### Kategori Bazlı Fiyat Analizi

`GET /api/v1/prices/category/:category`

- **Açıklama**: Belirli bir hurda kategorisi için tüm şirketlerin fiyatlarını döndürür
- **Parametreler**:
    - `category`: Hurda kategorisi (DKP, Ekstra, Grup1, Grup2, Talas)
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Örnek Yanıt**:
```JSON
{
  "category": "DKP",
  "currency": "TRY",
  "timestamp": "2025-04-07T12:00:00Z",
  "prices": [
    {
      "company": "Asil Çelik",
      "price": 15000,
      "updateDate": "2025-03-22T00:00:00Z"
    },
    {
      "company": "Çolakoğlu",
      "price": 15200,
      "updateDate": "2025-03-23T00:00:00Z"
    }
  ]
}
```
## Grafik Veri Endpointleri

### Şirket Bazlı Trend Verileri

`GET /api/v1/charts/trend/:company`

- **Açıklama**: Belirli bir şirketin zaman içindeki fiyat trendlerini grafik verisi olarak döndürür
- **Parametreler**:
    - `company`: Şirket adı (URL-encoded)
    - `startDate` (opsiyonel): Başlangıç tarihi (YYYY-MM-DD), varsayılan: 1 yıl önce
    - `endDate` (opsiyonel): Bitiş tarihi (YYYY-MM-DD), varsayılan: bugün
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Örnek Yanıt**:
```JSON
{
  "company": "Asil Çelik",
  "currency": "TRY",
  "labels": ["2024-04", "2024-05", "2024-06", "..."],
  "datasets": [
    {
      "label": "DKP",
      "data": [12000, 12300, 12600, "..."]
    },
    {
      "label": "Ekstra",
      "data": [11500, 11800, 12100, "..."]
    }
  ]
}
```

### Kategori Bazlı Karşılaştırma

`GET /api/v1/charts/category/:category/comparison`

- **Açıklama**: Belirli bir kategoride, şirketler arası fiyat karşılaştırmasını grafik verisi olarak döndürür
- **Parametreler**:
    - `category`: Hurda kategorisi (DKP, Ekstra, Grup1, Grup2, Talas)
    - `startDate` (opsiyonel): Başlangıç tarihi (YYYY-MM-DD), varsayılan: 3 ay önce
    - `endDate` (opsiyonel): Bitiş tarihi (YYYY-MM-DD), varsayılan: bugün
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Örnek Yanıt**:

```JSON
{
  "category": "DKP",
  "currency": "TRY",
  "labels": ["2025-01", "2025-02", "2025-03", "2025-04"],
  "datasets": [
    {
      "label": "Asil Çelik",
      "data": [14000, 14300, 14600, 15000]
    },
    {
      "label": "Çolakoğlu",
      "data": [14100, 14400, 14900, 15200]
    }
  ]
}
```
## Veri Dışa Aktarma Endpointleri

### HTML Tablo Olarak Dışa Aktarma

`GET /api/v1/export/html`

- **Açıklama**: Tüm güncel fiyat verilerini HTML tablo formatında döndürür
- **Parametreler**:
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Yanıt**: HTML formatında tablo

### CSV Olarak Dışa Aktarma

`GET /api/v1/export/csv`

- **Açıklama**: Fiyat verilerini CSV formatında dışa aktarır
- **Parametreler**:
    - `startDate` (opsiyonel): Başlangıç tarihi
    - `endDate` (opsiyonel): Bitiş tarihi
    - `company` (opsiyonel): Belirli bir şirket
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Yanıt**: CSV formatında dosya

## Metaveri Endpointleri

### Desteklenen Şirketler

`GET /api/v1/meta/companies`

- **Açıklama**: Sistemdeki tüm şirketlerin listesini döndürür
- **Örnek Yanıt**:

```JSON
{
  "companies": [
    {
      "id": "asil-celik",
      "name": "Asil Çelik",
      "lastUpdate": "2025-03-22T00:00:00Z"
    },
    {
      "id": "colakoglu",
      "name": "Çolakoğlu",
      "lastUpdate": "2025-03-23T00:00:00Z"
    }
  ]
}
```


# EndPoint Tablo

| HTTP Metodu | Endpoint                                       | Açıklama                                                                              | Parametreler                                                                                                                                                                   | Dönüş Formatı |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| **GET**     | `/api/v1/prices/latest`                        | Tüm şirketlerin en güncel hurda fiyatlarını döndürür                                  | `currency` (TRY/USD/EUR)<br>`category` (DKP/Ekstra/Grup1/Grup2/Talas)                                                                                                          | JSON          |
| **GET**     | `/api/v1/prices/latest/:company`               | Belirtilen şirketin en güncel fiyatlarını döndürür                                    | `company` (şirket adı)<br>`currency` (TRY/USD/EUR)                                                                                                                             | JSON          |
| **GET**     | `/api/v1/prices/history/:company`              | Bir şirketin tarihsel fiyat verilerini döndürür                                       | `company` (şirket adı)<br>`startDate` (YYYY-MM-DD)<br>`endDate` (YYYY-MM-DD)<br>`interval` (daily/weekly/monthly)<br>`currency` (TRY/USD/EUR)<br>`category` (hurda kategorisi) | JSON          |
| **GET**     | `/api/v1/prices/comparison`                    | Tüm şirketlerin fiyatlarını karşılaştırmalı tablo olarak döndürür                     | `currency` (TRY/USD/EUR)<br>`format` (json/html)                                                                                                                               | JSON/HTML     |
| **GET**     | `/api/v1/prices/category/:category`            | Belirli bir hurda kategorisi için tüm şirketlerin fiyatlarını döndürür                | `category` (hurda kategorisi)<br>`currency` (TRY/USD/EUR)                                                                                                                      | JSON          |
| **GET**     | `/api/v1/charts/trend/:company`                | Bir şirketin zaman içindeki fiyat trendlerini grafik verisi olarak döndürür           | `company` (şirket adı)<br>`startDate` (YYYY-MM-DD)<br>`endDate` (YYYY-MM-DD)<br>`currency` (TRY/USD/EUR)                                                                       | JSON          |
| **GET**     | `/api/v1/charts/category/:category/comparison` | Bir kategoride, şirketler arası fiyat karşılaştırmasını grafik verisi olarak döndürür | `category` (hurda kategorisi)<br>`startDate` (YYYY-MM-DD)<br>`endDate` (YYYY-MM-DD)<br>`currency` (TRY/USD/EUR)                                                                | JSON          |
| **GET**     | `/api/v1/export/html`                          | Tüm güncel fiyat verilerini HTML tablo formatında döndürür                            | `currency` (TRY/USD/EUR)                                                                                                                                                       | HTML          |
| **GET**     | `/api/v1/export/csv`                           | Fiyat verilerini CSV formatında dışa aktarır                                          | `startDate` (YYYY-MM-DD)<br>`endDate` (YYYY-MM-DD)<br>`company` (şirket adı)<br>`currency` (TRY/USD/EUR)                                                                       | CSV           |
| **GET**     | `/api/v1/meta/companies`                       | Sistemdeki tüm şirketlerin listesini döndürür                                         | -                                                                                                                                                                              | JSON          |
| **GET**     | `/api/v1/meta/stats`                           | API kullanım istatistiklerini döndürür                                                | -                                                                                                                                                                              | JSON          |