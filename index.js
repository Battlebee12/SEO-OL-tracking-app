// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5432;

app.use(cors());
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
