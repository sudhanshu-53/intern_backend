// Debug function to check Text-to-Speech functionality
function checkTTSSupport() {
    console.log('Checking TTS support...');
    
    // Check basic support
    const hasSupport = 'speechSynthesis' in window;
    console.log('Basic TTS Support:', hasSupport);
    
    if (!hasSupport) {
        return {
            supported: false,
            reason: 'Speech synthesis not available in this browser'
        };
    }

    // Check voices
    const voices = speechSynthesis.getVoices();
    console.log('Available voices:', voices.length);
    voices.forEach(voice => {
        console.log(`- ${voice.name} (${voice.lang})`);
    });

    // Check if speech synthesis is actually working
    try {
        const utterance = new SpeechSynthesisUtterance('Test speech synthesis');
        speechSynthesis.speak(utterance);
        return {
            supported: true,
            voicesAvailable: voices.length,
            voices: voices
        };
    } catch (error) {
        return {
            supported: false,
            reason: error.message
        };
    }
}

// Add this to the window object for testing in browser console
window.checkTTSSupport = checkTTSSupport;