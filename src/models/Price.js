import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
    },
    updateDate: {
        type: Date,
        default: Date.now,
    },
    fetchDate: {
        type: Date,
        default: Date.now,
    },
    prices: {
        DKP: Number,
        Ekstra: Number,
        Grup1: Number,
        Grup2: Number,
        Talas: Number,
    },
    exchangeRates: {
        USD: Number,
        EUR: Number,
    },
}, {
    timestamps: true, // Otomatik createdAt ve updatedAt alanları
});

const Price = mongoose.model('Price', priceSchema);

export default Price; 