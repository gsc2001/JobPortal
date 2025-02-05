const express = require('express');
const connectDB = require('./utils/db_loader');

const app = express();

// Connecting to DB
connectDB();

// Applying global middleware
app.use(express.json({ limit: '50mb' }));

// apply google strategy

// Connect routers
app.use('/api/core', require('./routes/api/core'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/jobs', require('./routes/api/jobs'));
app.use('/api/applications', require('./routes/api/applications'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
