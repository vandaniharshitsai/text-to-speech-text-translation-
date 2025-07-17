// Importing required packages
const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST route to handle text-to-speech conversion
router.post('/', async (req, res) => {
    const { text, languageCode } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY;

    try {
        // Make API request to Google Text-to-Speech API
        const response = await axios.post(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
                input: {
                    text: text
                },
                voice: {
                    languageCode: languageCode,
                    ssmlGender: 'NEUTRAL'
                },
                audioConfig: {
                    audioEncoding: 'MP3'
                }
            }
        );

        // Send back the audio content (Base64-encoded MP3)
        res.json({
            audioContent: response.data.audioContent
        });
    } catch (error) {
        console.error('Error during text-to-speech:', error);
        res.status(500).json({ error: 'Text-to-speech conversion failed' });
    }
});

module.exports = router;
