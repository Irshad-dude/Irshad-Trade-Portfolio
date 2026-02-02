const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 8123;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Static files (legacy - for backward compatibility)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Helper function to read store data
async function readStore() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading store:', error);
        return { trades: [], profile: {} };
    }
}

// Helper function to write store data
async function writeStore(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 4));
        return true;
    } catch (error) {
        console.error('Error writing store:', error);
        throw error;
    }
}

// React frontend routes are handled by static file serving below
// API routes follow...

// ============================================
// API ENDPOINTS (LEGACY - Now using JSONBin)
// ============================================
// NOTE: The frontend now uses JSONBin.io for global data persistence
// These endpoints are kept for backward compatibility but are no longer
// the primary data source. All new data writes go to JSONBin.
// ============================================

// API: Get data (LEGACY - Use JSONBin instead)
app.get('/api/data', async (req, res) => {
    try {
        const data = await readStore();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// API: Save data (LEGACY - Use JSONBin instead)
app.post('/api/data', async (req, res) => {
    try {
        await writeStore(req.body);
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// API: Store image URL
app.post('/store/image', async (req, res) => {
    try {
        const { imageUrl, tradeId } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'imageUrl is required' });
        }

        const data = await readStore();

        // If tradeId is provided, update specific trade
        if (tradeId) {
            const trade = data.trades.find(t => t.id === tradeId);
            if (trade) {
                trade.imageBefore = imageUrl;
            } else {
                return res.status(404).json({ error: 'Trade not found' });
            }
        } else {
            // Otherwise, create a new entry with just the image
            const newEntry = {
                id: Date.now().toString(),
                imageUrl: imageUrl,
                timestamp: new Date().toISOString()
            };
            data.trades.unshift(newEntry);
        }

        await writeStore(data);
        res.json({
            status: 'success',
            message: 'Image URL stored successfully',
            data: data
        });
    } catch (error) {
        console.error('Error storing image:', error);
        res.status(500).json({ error: 'Failed to store image URL' });
    }
});

// ============================================
// JSONBin Proxy Routes (Server-Side Secure)
// ============================================
// These routes keep the Master Key secure on the server
// and allow the frontend to interact with JSONBin safely
// ============================================

const { JSONBinService } = require('./js/jsonbin-service.js');

// GET: Fetch data from JSONBin (via backend)
app.get('/api/jsonbin/data', async (req, res) => {
    try {
        const data = await JSONBinService.fetchData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from JSONBin:', error);
        res.status(500).json({
            error: 'Failed to fetch data from JSONBin',
            message: error.message
        });
    }
});

// PUT: Save data to JSONBin (via backend)
app.put('/api/jsonbin/data', async (req, res) => {
    try {
        await JSONBinService.saveData(req.body);
        res.json({ status: 'success' });
    } catch (error) {
        console.error('Error saving to JSONBin:', error);
        res.status(500).json({
            error: 'Failed to save data to JSONBin',
            message: error.message
        });
    }
});

// ============================================
// Serve React Frontend (Production)
// ============================================
if (process.env.NODE_ENV === 'production') {
    // Serve React build static files
    app.use(express.static(path.join(__dirname, 'client/dist')));

    // Handle React Router - send all non-API routes to React
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api/') || req.path.startsWith('/store/')) {
            return next();
        }
        res.sendFile(path.join(__dirname, 'client/dist/index.html'));
    });
}

// Start server (only in local development, not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📊 API endpoint: http://localhost:${PORT}/api/data`);
        console.log(`🖼️  Image store: http://localhost:${PORT}/store/image`);
        console.log(`⚛️  React dev server should run on http://localhost:5173`);
    });
}

// Export for Vercel serverless functions
module.exports = app;
