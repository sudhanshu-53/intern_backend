// Enhanced TTS functionality with better debugging and error handling
class EnhancedTTS {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.isReading = false;
        this.currentUtterance = null;
        this.setupVoices();
    }

    async setupVoices() {
        // First try to get voices
        this.voices = window.speechSynthesis.getVoices();
        
        // If no voices are available, wait for them to load
        if (this.voices.length === 0) {
            try {
                await new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('Timeout waiting for voices'));
                    }, 5000); // 5 second timeout

                    window.speechSynthesis.onvoiceschanged = () => {
                        clearTimeout(timeoutId);
                        this.voices = window.speechSynthesis.getVoices();
                        resolve();
                    };
                });
            } catch (error) {
                console.error('Error loading voices:', error);
                throw error;
            }
        }

        console.log(`Loaded ${this.voices.length} voices`);
    }

    getVoiceForLanguage(langCode) {
        // Filter voices for the specified language
        const langVoices = this.voices.filter(voice => voice.lang.startsWith(langCode));
        
        // Try to find a preferred voice (Google, Microsoft, etc.)
        const preferredProviders = ['Google', 'Microsoft', 'Natural'];
        for (const provider of preferredProviders) {
            const voice = langVoices.find(v => v.name.includes(provider));
            if (voice) return voice;
        }
        
        // Fall back to any voice for the language
        return langVoices[0];
    }

    async speak(text, langCode = 'en-US') {
        if (!this.isSupported) {
            throw new Error('Speech synthesis is not supported');
        }

        if (!text || text.trim() === '') {
            throw new Error('No text provided for speech');
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language and voice
        utterance.lang = langCode;
        const voice = this.getVoiceForLanguage(langCode);
        if (voice) {
            utterance.voice = voice;
        }

        // Add event handlers
        return new Promise((resolve, reject) => {
            utterance.onend = () => {
                this.isReading = false;
                resolve();
            };

            utterance.onerror = (event) => {
                this.isReading = false;
                reject(new Error(`Speech synthesis error: ${event.error}`));
            };

            // Start speaking
            this.isReading = true;
            this.currentUtterance = utterance;
            window.speechSynthesis.speak(utterance);
        });
    }

    stop() {
        if (this.isReading) {
            window.speechSynthesis.cancel();
            this.isReading = false;
            this.currentUtterance = null;
        }
    }

    // Debug method to log TTS state
    debugStatus() {
        return {
            isSupported: this.isSupported,
            voicesAvailable: this.voices.length,
            isReading: this.isReading,
            availableVoices: this.voices.map(v => ({
                name: v.name,
                lang: v.lang,
                isDefault: v.default,
                isLocalService: v.localService
            }))
        };
    }
}

// Create a global instance
window.tts = new EnhancedTTS();