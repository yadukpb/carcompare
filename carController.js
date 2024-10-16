const { Car } = require('./data');

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({}, 'id company name');
        res.json(cars);
    } catch (error) {
        console.error('Error fetching car list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const carId = parseInt(req.params.id);
        console.log(`Fetching car with ID: ${carId}`);
        
        const car = await Car.findOne({ id: carId });
        console.log(`Car found:`, car);

        if (car) {
            res.json(car);
        } else {
            console.log(`Car with ID ${carId} not found`);
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (error) {
        console.error('Error fetching car data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createCar = async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const updatedCar = await Car.findOneAndUpdate({ id: parseInt(req.params.id) }, req.body, { new: true });
        if (updatedCar) {
            res.json(updatedCar);
        } else {
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const deletedCar = await Car.findOneAndDelete({ id: parseInt(req.params.id) });
        if (deletedCar) {
            res.json({ message: 'Car deleted successfully' });
        } else {
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.compareCars = async (req, res) => {
    const carIds = req.query.ids.split(',').map(Number);
    try {
        const cars = await Car.find({ id: { $in: carIds } });
        res.json(cars);
    } catch (error) {
        console.error('Error fetching car comparison:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
