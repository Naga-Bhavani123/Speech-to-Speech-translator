document.getElementById('start-recognition').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert('Your browser does not support Speech Recognition. Please use Google Chrome for the best experience.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'te-IN'; // Telugu language
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        console.log('Speech recognition service has started');
    };

    recognition.onresult = (event) => {
        const recognizedText = event.results[0][0].transcript;
        document.getElementById('recognized-text').textContent = `Recognized: ${recognizedText}`;
    };

    recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            alert('Microphone access is not allowed. Please check your browser and system settings.');
        }
    };

    recognition.onend = () => {
        console.log('Speech recognition service disconnected');
    };

    recognition.start();
});

console.log(window.SpeechSynthesisUtterance)

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        alert('Your browser does not support Speech Synthesis.');
        return;
    }


    translateText(text, 'te|en').then(translatedText => {
        text = translatedText;
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Ensure English language



        // Speak the text
        window.speechSynthesis.speak(utterance);

    }).catch(error => {
        console.error('Error:', error);
    });




    console.log(text)


}

async function translateText(text, langpair) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Translation request failed');
    }

    const data = await response.json();
    return data.responseData.translatedText;
}

document.getElementById('play-recognition').addEventListener('click', () => {
    const recognizedText = document.getElementById('recognized-text').textContent.replace('Recognized: ', "");
    console.log(recognizedText)
    if (recognizedText) {
        console.log("click")
        speakText(recognizedText);
    }
});