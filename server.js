const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// GA4 Measurement Protocol credentials (replace with actual values)
const MEASUREMENT_ID = 'G-VH9JNPRNTK';
const API_SECRET = 'YOUR_API_SECRET';

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to receive and forward events to GA4
app.post('/track-event', async (req, res) => {
    const eventData = req.body;
    const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;

    try {
        const response = await axios.post(endpoint, eventData);
        console.log('GA4MP Response:', response.status, response.statusText);
        res.status(200).send('Event forwarded to GA4');
    } catch (error) {
        console.error('Error forwarding event to GA4:', error.message);
        res.status(500).send('Failed to forward event');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});