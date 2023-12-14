const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Connect to MongoDB - Replace 'your-mongodb-connection-string' with your actual MongoDB connection details
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files
app.use(express.static('public'));

// Create a User model
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
  });

// Registration routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Create a new user
  const newUser = new User({
    username,
    email,
    password,
  });

  try {
    // Save the user to the database
    await newUser.save();
    res.send('Registration successful! <a href="/login">Login</a>');
  } catch (error) {
    res.send('Error during registration.');
  }
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      res.send('Login successful!');
    } else {
      res.send('Invalid username or password.');
    }
  } catch (error) {
    res.send('Error during login.');
  }
});


app.get('/logout' , (req,res) => {
    res.render('home') ;
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
