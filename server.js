const express = require("express");
const axios = require('axios');
const path = require("path");
const app = express();
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
require('dotenv').config();
const hostname = 'localhost';
const port = process.env.PORT || 4000;
var refresh_token;
var access_token;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
        cookie: { maxAge: 86400000 },
        store: new MemoryStore({
            checkPeriod: 86400000 // prune expired entries every 24h
        }),
        resave: false,
        secret: process.env.SESSION_SECRET
    })
);

async function handleAuthentication() {
    await authenticateToken();
    setInterval(async () => {
        console.log('Refreshing token...');
        try {
            await refreshToken();
        } catch (err) {
            console.error('Token refresh failed:', err.message);
        }
    }, 15 * 60 * 1000);
}

async function authenticateToken() {
    const creds = new URLSearchParams({
        grant_type: 'password',
        username: process.env.MANGADEX_USERNAME,
        password: process.env.MANGADEX_PASSWORD,
        client_id: process.env.MANGADEX_CLIENTID,
        client_secret: process.env.MANGADEX_SECRET
    });

    const response = await axios({
        method: 'POST',
        url: `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
        data: creds
    });

    access_token = response.data.access_token;
    refresh_token = response.data.refresh_token;

    return response.data.access_token;
}

async function refreshToken() {
    const creds = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: process.env.MANGADEX_CLIENTID,
        client_secret: process.env.MANGADEX_SECRET
    });

    const response = await axios({
        method: 'POST',
        url: 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token',
        data: creds
    });

    access_token = response.data.access_token;

    return response.data.access_token;
}

app.post('/api/sources/manga-dex/token/authenticate', async (req, res) => {
    try {
        const token = await authenticateToken();
        res.json(token);
    } catch (err) {
        res.status(500).json({ error: 'Token authentication failed', details: err.message });
    }
});

app.post('/api/sources/manga-dex/token/refresh', async (req, res) => {
    try {
        const token = await refreshToken();
        res.json(token);
    } catch (err) {
        res.status(500).json({ error: 'Token refresh failed', details: err.message });
    }
});

app.get('/api/mangas/:title', async (req, res) => {
    const baseURL = 'https://api.mangadex.org';
    try {    
        const response = await axios({
            method: 'GET',
            url: `${baseURL}/manga`,
            params: {
                title: req.params.title,
                limit: 24,
                offset: parseInt(req.query.page) * 24
            }
        });
        res.json(response.data);
    }
    catch(err) {
        res.status(500).json({ error: 'Manga search failed', details: err.message });
    }
});

app.get('/api/manga/:mangaID', async (req, res) => {
    const baseURL = 'https://api.mangadex.org';
    try {    
        const response = await axios({
            method: 'GET',
            url: `${baseURL}/manga/${req.params.mangaID}`,
        });
        res.json(response.data);
    }
    catch(err) {
        res.status(500).json({ error: 'Manga search failed', details: err.message });
    }
});

app.get('/api/manga/:mangaID/feed', async (req, res) => {
    const baseURL = 'https://api.mangadex.org';
    const languages = ['en'];
    try {
        const response = await axios({
            method: 'GET',
            url: `${baseURL}/manga/${req.params.mangaID}/feed`,
            params: {
                translatedLanguage: ['en'],
                order: {
                    chapter: 'asc'
                }
            }
        });
        res.json(response.data);
    }
    catch(err) {
        res.status(500).json({ error: 'Chapter search failed', details: err.message });
    }
});

app.get('/api/manga/cover/:coverID', async (req, res) => {
    const baseURL = 'https://api.mangadex.org';
    try {
        const response = await axios({
            method: 'GET',
            url: `${baseURL}/cover/${req.params.coverID}`,
        });
        res.json(response.data);
    }
    catch(err) {
        res.status(500).json({ error: 'Cover search failed', details: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'search.html'));
});

app.get('/header.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'header.html'));
});

app.get('/loader.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'loader.html'));
});

handleAuthentication();

app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
});