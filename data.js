const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://anandhakrishnanks11a:JYJ86CTkn4zDORyp@car0.yluvn.mongodb.net/?retryWrites=true&w=majority&appName=car0';

// Define the schema for the car data
const carSchema = new mongoose.Schema({
  id: Number,
  name: String,
  company: String,
  price: String,
  onRoadPrice: String,
  engine: String,
  engineType: String,
  displacement: String,
  power: String,
  fuelType: String,
  mileage: String,
  topSpeed: String,
  fuelTankCapacity: String,
  emissionNorm: String,
  frontSuspension: String,
  rearSuspension: String,
  steeringType: String,
  frontBrakeType: String,
  rearBrakeType: String,
  tyreSize: String,
  tyreType: String,
  wheelSize: String,
  alloyWheelSizeFront: String,
  alloyWheelSizeRear: String,
  imageUrl1: String,
  imageUrl2: String
});

// Create a model based on the schema
const Car = mongoose.model('Car', carSchema);

async function getCarById(id) {
  try {
    const car = await Car.findOne({ id: id });
    return car;
  } catch (error) {
    console.error('Error fetching car data:', error);
    return null;
  }
}

async function getMultipleCars(ids) {
  try {
    const cars = await Car.find({ id: { $in: ids } });
    return cars;
  } catch (error) {
    console.error('Error fetching multiple car data:', error);
    return [];
  }
}

module.exports = {
  Car,
  getCarById,
  getMultipleCars
};