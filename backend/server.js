// Importing required packages
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');  // Importing CORS middleware

// Initialize express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Define the port for the server
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming requests
app.use(express.json());

// Use CORS middleware to allow cross-origin requests
app.use(cors());  // Allow requests from any origin (by default)

// Translation route
app.post('/api/translate', async (req, res) => {
    const { text, target } = req.body;  // Changed `targetLanguage` to `target`
    const apiKey = process.env.GOOGLE_API_KEY;

    try {
        // Make API request to Google Translate API
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                q: text,
                target: target  // Changed `targetLanguage` to `target`
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

// Text-to-Speech route
app.post('/api/speak', async (req, res) => {
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

        // Send back audio content (Base64-encoded)
        res.json({
            audioContent: response.data.audioContent
        });
    } catch (error) {
        console.error('Error during text-to-speech:', error);
        res.status(500).json({ error: 'Text-to-speech failed' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
