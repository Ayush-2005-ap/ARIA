require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('ARIA Backend is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
