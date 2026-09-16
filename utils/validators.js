const SUPPORTED_LANGUAGES = {
  English: ["Female Voice", "Male Voice"],
  Hindi: ["Female Voice", "Male Voice"],
  Marathi: ["Female Voice", "Male Voice"],
  German: ["Female Voice", "Male Voice"],
};

export const validateTTSRequest = ({ text, language, voice }) => {
  if (!text || !text.trim()) {
    return "Text is required.";
  }

  if (text.length > 5000) {
    return "Text must not exceed 5000 characters.";
  }

  if (!language || !SUPPORTED_LANGUAGES[language]) {
    return "Unsupported language.";
  }

  if (!voice || !SUPPORTED_LANGUAGES[language].includes(voice)) {
    return "Voice is not available for the selected language.";
  }

  return null;
};

export { SUPPORTED_LANGUAGES };
