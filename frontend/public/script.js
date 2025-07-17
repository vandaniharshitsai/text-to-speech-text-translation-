const translateBtn = document.getElementById("translateBtn");
const audioBtn = document.getElementById("audioBtn");
const textInput = document.getElementById("textInput");
const targetLanguage = document.getElementById("targetLanguage");
const translatedTextPara = document.getElementById("translatedText");
const audioPlayer = document.getElementById("audioPlayer");

let translatedText = ""; // to store the translated text

// Handle translation button click
translateBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    const targetLang = targetLanguage.value;

    if (!text) {
        alert("Please enter some text to translate.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                target: targetLang  // Ensure 'target' key matches backend API
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.translatedText) {
                translatedText = data.translatedText;
                translatedTextPara.textContent = translatedText;
            } else {
                alert("Translation failed: No translated text received.");
            }
        } else {
            alert("Translation failed: " + (data.error || "Unknown error"));
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred while translating.");
    }
});

// Handle audio button click (Text-to-Speech)
audioBtn.addEventListener("click", async () => {
    if (!translatedText) {
        alert("Please translate text first before listening.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/speak", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: translatedText,
                languageCode: targetLanguage.value
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.audioContent) {
            // Decode Base64 and convert to Blob
            const audioBytes = atob(data.audioContent);
            const byteArray = new Uint8Array(audioBytes.length);
            for (let i = 0; i < audioBytes.length; i++) {
                byteArray[i] = audioBytes.charCodeAt(i);
            }
        
            const audioBlob = new Blob([byteArray], { type: "audio/mp3" });
            const audioUrl = URL.createObjectURL(audioBlob);
        
            audioPlayer.src = audioUrl;
            audioPlayer.play();
        } else {
            alert("Failed to generate audio.");
        }
        
    } catch (err) {
        console.error(err);
        alert("An error occurred while generating speech.");
    }
});
