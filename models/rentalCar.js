const mongoose = require('mongoose');

const rentalCarSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    dailyRate: { type: Number, required: true },
    available: { type: Boolean, default: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
});

const RentalCar = mongoose.model('RentalCar', rentalCarSchema);

module.exports = RentalCar;