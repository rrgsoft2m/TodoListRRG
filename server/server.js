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
    origin: process.env.CLIENT_URL || '*',
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

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Keep-alive mechanism for Render
const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes
const renderUrl = process.env.RENDER_EXTERNAL_URL;

if (renderUrl) {
    const https = require('https');
    setInterval(() => {
        https.get(renderUrl + '/health', (res) => {
            console.log(`Keep-alive ping status: ${res.statusCode}`);
        }).on('error', (e) => {
            console.error(`Keep-alive ping error: ${e.message}`);
        });
    }, KEEP_ALIVE_INTERVAL);
}

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
