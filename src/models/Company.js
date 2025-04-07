import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

const Company = mongoose.model('Company', companySchema);

export default Company; 