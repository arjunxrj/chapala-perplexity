const express = require('express');
const path = require('path');
const app = express();

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for index_1.html
app.get('/index_1.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index_1.html'));
});

// Route for index_2.html
app.get('/index_2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index_2.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index_1.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Casa Chapala Menu Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});