// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://trackmyshifts.netlify.app',
  'http://localhost:3000'
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Users route
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);
const shiftRoutes = require('./routes/shifts');
app.use('/api/shifts', shiftRoutes);


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

