const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// App
const app = express();

// Connect to database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));
app.use(cookieParser());

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/user', require('./routes/api/user'));

// Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
