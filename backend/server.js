require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/messages');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('ARIA Backend is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
