const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/todos', require('./src/routes/todoRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
