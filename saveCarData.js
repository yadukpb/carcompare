const mongoose = require('mongoose');
const { carData } = require('./data.js');  // Import the carData from your data.js file

// Your MongoDB connection string
const MONGO_URI = 'mongodb+srv://anandhakrishnanks11a:JYJ86CTkn4zDORyp@car0.yluvn.mongodb.net/?retryWrites=true&w=majority&appName=car0';

// Define the schema for the car data
const carSchema = new mongoose.Schema({
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
  image: String
});

const Car = mongoose.model('Car', carSchema);

async function saveCarData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const carArray = Object.values(carData);

    const result = await Car.insertMany(carArray);

    console.log(`${result.length} documents were inserted`);
  } catch (error) {
    console.error("Error occurred while saving car data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

saveCarData();