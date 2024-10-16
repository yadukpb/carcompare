const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const app = express();

const { getCarById, getMultipleCars, getCarsByIds } = require('./data');
const { Car } = require('./data');
const carController = require('./carController');
const port = process.env.PORT || 3001;


const allowedOrigins = [
 'http://localhost:5500',  
  'http://127.0.0.1:5500',  
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: function(origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const MONGO_URI = 'mongodb+srv://anandhakrishnanks11a:JYJ86CTkn4zDORyp@car0.yluvn.mongodb.net/?retryWrites=true&w=majority&appName=car0';


mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string:', MONGO_URI);
  });


const User = mongoose.model('User', {
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

console.log('User model defined:', User);

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.route('/signup')
  .get((req, res) => {
    console.log('GET /signup request received');
    console.log('Sending signup.html file');
    res.sendFile(path.join(__dirname, 'signup.html'));
  })
  .post(async (req, res) => {
    console.log('POST /signup request received');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    try {
      const { email, password, role } = req.body;
      console.log('Extracted data:', { email, role });

      console.log('Checking if user exists...');
      const existingUser = await User.findOne({ email });
      console.log('Existing user:', existingUser);
      
      if (existingUser) {
        console.log('User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }

      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');

      console.log('Creating new user...');
      const user = new User({
        email,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user'
      });
      console.log('New user object:', user);

      console.log('Saving user to database...');
      await user.save();
      console.log('User saved successfully');

      console.log('User registered successfully');
      res.status(201).json({ message: 'User registered successfully', role: user.role });
    } catch (error) {
      console.error('Error in signup process:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


app.post('/login', async (req, res) => {
  console.log('POST /login request received');
  console.log('Request body:', req.body);

  try {
    const { username, password } = req.body;
    console.log('Extracted data:', { username });

    const user = await User.findOne({ email: username });
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Is password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('Login successful');
    let redirectUrl = user.role === 'admin' ? '/companyHome.html' : '/home.html';
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      role: user.role,
      redirectUrl: redirectUrl
    });
  } catch (error) {
    console.error('Error in login process:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.get('/car/:id', async (req, res) => {
  const carId = parseInt(req.params.id);
  const car = await getCarById(carId);
  if (car) {
    res.json(car);
  } else {
    res.status(404).json({ error: 'Car not found' });
  }
});


app.get('/api/cars/:id', carController.getCarById);
app.post('/api/cars', carController.createCar);
app.put('/api/cars/:id', carController.updateCar);
app.delete('/api/cars/:id', carController.deleteCar);
app.get('/api/compare', carController.compareCars);


app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ message: 'Could not log out, please try again' });
            } else {
                res.clearCookie('connect.sid'); 
                res.status(200).json({ message: 'Logout successful' });
            }
        });
    } else {
        res.status(200).json({ message: 'Logout successful' });
    }
});

app.get('/api/cars', async (req, res) => {
  try {
    const { brand } = req.query;
    let query = {};
    
    if (brand) {
      query = { company: { $regex: brand, $options: 'i' } };
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    console.error('Error fetching car data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const startServer = (port) => {
  console.log(`Attempting to start server on port ${port}`);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  }).on('error', (err) => {
    console.error('Server start error:', err);
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying with port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Unhandled server error:', err);
    }
  });
};


console.log('Starting server...');
startServer(port);
