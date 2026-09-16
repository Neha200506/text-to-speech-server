export const generateSpeech = async ({ text, language, voice }) => {
  // Actual TTS provider integration will be added on Day 10.

  return {
    text,
    language,
    voice,
    audio: null,
  };
};
