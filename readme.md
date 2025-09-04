# Türkiye Hurda Fiyatları API - Kullanıcı Dökümantasyonu

Bu API, Türkiye'deki demir-çelik fabrikalarından alınan hurda fiyatlarını ve döviz kuru bilgilerini sağlayan bir RESTful API'dir. API'yi kullanarak en güncel fiyatları, tarihsel verileri, fiyat karşılaştırmalarını ve grafik analizlerini elde edebilirsiniz.

>[!Note]
>API geliştirme aşamasındadır, mevcut durumu ve ayrıntıları Swagger dökümantasyonundan ve Github Reposundan takip edebilirsiniz.

>[!Note]
>API tüm isteklerde TRY cinsinden cevap vermektedir. 'Currency' dönüşümü henüz aktif değildir.

>[!tip]
>**Swagger Dokümantasyonu**: API'nin interaktif dokümantasyonuna erişmek için `/api/v1/api-docs` endpoint'ini ziyaret edin.

## API Temel Bilgileri

- **Base URL**: `https://tr-scrap-price.onrender.com/api/v1` (Production)
- **Local URL**: `http://127.0.0.1:3000/api/v1` (Development)
- **Format**: JSON ve HTML (bazı endpoint'lerde)
- **Auth**: Public API'dır.
- **Rate Limiting**: API kullanımı rate limiting ile sınırlandırılmıştır.

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
    - `period` (opsiyonel): Gün cinsinden dönem, varsayılan: 30
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Örnek Yanıt**:

```JSON
{
  "company": "Asil Çelik",
  "currency": "TRY",
  "history": [
    {
      "date": "2024-01-01T00:00:00Z",
      "prices": {
        "DKP": 11000,
        "Ekstra": 10500,
        "Grup1": 10000,
        "Grup2": 9500,
        "Talas": 9000
      }
    },
    {
      "date": "2024-01-02T00:00:00Z",
      "prices": {
        "DKP": 11200,
        "Ekstra": 10700,
        "Grup1": 10200,
        "Grup2": 9700,
        "Talas": 9200
      }
    }
  ]
}
```

### Şirket Tarihsel Verilerini HTML Olarak Dışa Aktarma

`GET /api/v1/prices/history/:company/export/html`

- **Açıklama**: Belirli bir şirketin tarihsel fiyat verilerini HTML formatında döndürür
- **Parametreler**:
    - `company`: Şirket adı (URL-encoded)
    - `period` (opsiyonel): Gün cinsinden dönem, varsayılan: 30
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Yanıt**: HTML formatında tablo

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
## Grafik Veri Endpointleri (Geliştirme Aşamasında)

>[!Warning]
>Bu endpoint'ler henüz geliştirme aşamasındadır ve şu anda sadece placeholder mesajları döndürür.

### Şirket Bazlı Trend Verileri

`GET /api/v1/charts/trend/:company`

- **Açıklama**: Belirli bir şirketin zaman içindeki fiyat trendlerini grafik verisi olarak döndürür
- **Durum**: Geliştirme aşamasında
- **Parametreler**:
    - `company`: Şirket adı (URL-encoded)
    - `period` (opsiyonel): Gün cinsinden dönem, varsayılan: 30
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Şu Anki Yanıt**:
```JSON
{
  "message": "Şirket Trend Grafiği Verileri: [company_name], Yakında..."
}
```

### Kategori Bazlı Karşılaştırma

`GET /api/v1/charts/category/:category/comparison`

- **Açıklama**: Belirli bir kategoride, şirketler arası fiyat karşılaştırmasını grafik verisi olarak döndürür
- **Durum**: Geliştirme aşamasında
- **Parametreler**:
    - `category`: Hurda kategorisi (DKP, Ekstra, Grup1, Grup2, Talas)
    - `period` (opsiyonel): Gün cinsinden dönem, varsayılan: 30
    - `currency` (opsiyonel): Para birimi (TRY, USD, EUR), varsayılan: TRY
- **Şu Anki Yanıt**:
```JSON
{
  "message": "Kategori Karşılaştırma Grafiği Verileri: [category], Yakında..."
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
- **Durum**: Geliştirme aşamasında
- **Şu Anki Yanıt**: "CSV Dışa Aktarma, Yakında..."

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

| HTTP Metodu | Endpoint                                       | Açıklama                                                                              | Parametreler                                                                                                                                                                   | Dönüş Formatı | Durum |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ----- |
| **GET**     | `/api/v1/prices/latest`                        | Tüm şirketlerin en güncel hurda fiyatlarını döndürür                                  | `currency` (TRY/USD/EUR)                                                                                                                                                       | JSON          | ✅ Aktif |
| **GET**     | `/api/v1/prices/latest/:company`               | Belirtilen şirketin en güncel fiyatlarını döndürür                                    | `company` (şirket adı)<br>`currency` (TRY/USD/EUR)                                                                                                                             | JSON          | ✅ Aktif |
| **GET**     | `/api/v1/prices/history/:company`              | Bir şirketin tarihsel fiyat verilerini döndürür                                       | `company` (şirket adı)<br>`period` (gün sayısı)<br>`currency` (TRY/USD/EUR)                                                                                                    | JSON          | ✅ Aktif |
| **GET**     | `/api/v1/prices/history/:company/export/html`  | Bir şirketin tarihsel verilerini HTML formatında döndürür                             | `company` (şirket adı)<br>`period` (gün sayısı)<br>`currency` (TRY/USD/EUR)                                                                                                    | HTML          | ✅ Aktif |
| **GET**     | `/api/v1/prices/category/:category`            | Belirli bir hurda kategorisi için tüm şirketlerin fiyatlarını döndürür                | `category` (hurda kategorisi)<br>`currency` (TRY/USD/EUR)                                                                                                                      | JSON          | ✅ Aktif |
| **GET**     | `/api/v1/charts/trend/:company`                | Bir şirketin zaman içindeki fiyat trendlerini grafik verisi olarak döndürür           | `company` (şirket adı)<br>`period` (gün sayısı)<br>`currency` (TRY/USD/EUR)                                                                                                    | JSON          | 🚧 Geliştirme |
| **GET**     | `/api/v1/charts/category/:category/comparison` | Bir kategoride, şirketler arası fiyat karşılaştırmasını grafik verisi olarak döndürür | `category` (hurda kategorisi)<br>`period` (gün sayısı)<br>`currency` (TRY/USD/EUR)                                                                                             | JSON          | 🚧 Geliştirme |
| **GET**     | `/api/v1/export/html`                          | Tüm güncel fiyat verilerini HTML tablo formatında döndürür                            | `currency` (TRY/USD/EUR)                                                                                                                                                       | HTML          | ✅ Aktif |
| **GET**     | `/api/v1/export/csv`                           | Fiyat verilerini CSV formatında dışa aktarır                                          | -                                                                                                                                                                              | CSV           | 🚧 Geliştirme |
| **GET**     | `/api/v1/meta/companies`                       | Sistemdeki tüm şirketlerin listesini döndürür                                         | -                                                                                                                                                                              | JSON          | ✅ Aktif |
| **GET**     | `/api/v1/meta/stats`                           | API kullanım istatistiklerini döndürür                                                | -                                                                                                                                                                              | JSON          | ✅ Aktif |
| **GET**     | `/api/v1/api-docs`                             | Swagger API dokümantasyonu                                                            | -                                                                                                                                                                              | HTML          | ✅ Aktif |

## Teknik Detaylar

### Veri Yapısı
- **Hurda Kategorileri**: DKP, Ekstra, Grup1, Grup2, Talas
- **Para Birimleri**: TRY (varsayılan), USD, EUR
- **Veri Güncelleme**: Günlük otomatik güncelleme (Cron job: 07:00)

### Rate Limiting
- **Genel Limit**: Tüm endpoint'ler için uygulanır
- **Ağır İşlemler**: Export ve Charts endpoint'leri için daha sıkı limitler

### Hata Kodları
- **200**: Başarılı istek
- **404**: Veri bulunamadı
- **429**: Rate limit aşıldı
- **500**: Sunucu hatası