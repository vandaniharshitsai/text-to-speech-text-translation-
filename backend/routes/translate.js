// Importing required packages
const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST route to handle text translation
router.post('/', async (req, res) => {
    const { text, targetLanguage } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY;

    try {
        // Make API request to Google Translate API
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                q: text,
                target: targetLanguage
            }
        );

        // Send back translated text
        res.json({
            translatedText: response.data.data.translations[0].translatedText
        });
    } catch (error) {
        console.error('Error during translation:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

module.exports = router;
