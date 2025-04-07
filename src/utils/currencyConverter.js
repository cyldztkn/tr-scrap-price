const convertCurrency = (price, fromCurrency, toCurrency, exchangeRates) => {
    if (fromCurrency === toCurrency) {
        return price;
    }

    let convertedPrice = price;

    if (fromCurrency === 'TRY') {
        if (toCurrency === 'USD') {
            convertedPrice = price / exchangeRates.USD;
        } else if (toCurrency === 'EUR') {
            convertedPrice = price / exchangeRates.EUR;
        }
    } else if (fromCurrency === 'USD') {
        if (toCurrency === 'TRY') {
            convertedPrice = price * exchangeRates.USD;
        } else if (toCurrency === 'EUR') {
            convertedPrice = (price * exchangeRates.USD) / exchangeRates.EUR; // USD -> EUR için çapraz kur
        }
    } else if (fromCurrency === 'EUR') {
        if (toCurrency === 'TRY') {
            convertedPrice = price * exchangeRates.EUR;
        } else if (toCurrency === 'USD') {
            convertedPrice = (price * exchangeRates.EUR) / exchangeRates.USD; // EUR -> USD için çapraz kur
        }
    }

    return parseFloat(convertedPrice.toFixed(2)); // 2 ondalık basamağa yuvarla
};

export default convertCurrency; 