const RentalCar = require('./models/rentalCar');

exports.getAllRentalCars = async (req, res) => {
    try {
        const rentalCars = await RentalCar.find().populate('location');
        res.json(rentalCars);
    } catch (error) {
        console.error('Error fetching rental cars:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getRentalCarsByLocation = async (req, res) => {
    try {
        const locationId = req.params.locationId;
        const rentalCars = await RentalCar.find({ location: locationId }).populate('location');
        res.json(rentalCars);
    } catch (error) {
        console.error('Error fetching rental cars by location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createRentalCar = async (req, res) => {
    try {
        const newRentalCar = new RentalCar(req.body);
        await newRentalCar.save();
        res.status(201).json(newRentalCar);
    } catch (error) {
        console.error('Error creating rental car:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

