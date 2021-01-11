const express = require('express');
const connectDB = require('./utils/db_loader');

const app = express();

// Connecting to DB
connectDB();

// Applying global middleware
app.use(express.json());

// apply google strategy

// Connect routers
app.use('/api/core', require('./routes/api/core'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
