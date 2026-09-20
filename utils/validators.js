const SUPPORTED_LANGUAGES = {
  English: ["Female Voice", "Male Voice"],
  Hindi: ["Female Voice", "Male Voice"],
  Marathi: ["Female Voice", "Male Voice"],
  German: ["Female Voice", "Male Voice"],
};

// Script regex patterns
const DEVANAGARI_REGEX = /[\u0900-\u097F]/g;
const LATIN_REGEX = /[a-zA-Z\u00C0-\u024F]/g;

// German-specific character indicators
const GERMAN_CHAR_REGEX = /[äöüßÄÖÜ]/;

// Marathi-specific character indicators (ळ, ॲ, ऑ, ॵ, ऱ)
const MARATHI_CHAR_REGEX = /[\u0933\u0972\u0973\u0975\u0931]/;

const MARATHI_WORDS = new Set([
  "आहे", "आहेत", "नाही", "नाहीत", "होता", "होती", "होते", "होतो", "होत्या",
  "नव्हता", "नव्हती", "नव्हते", "नव्हतो", "असेल", "असावा", "असावी", "असावे",
  "मी", "तू", "तो", "ती", "ते", "त्या", "आपण", "आम्ही", "तुम्ही",
  "माझा", "माझी", "माझे", "माझ्या", "तुझा", "तुझी", "तुझे", "तुझ्या",
  "त्याचा", "त्याची", "त्याचे", "त्याच्या", "तिचा", "तिची", "तिचे", "तिच्या",
  "आमचा", "आमची", "आमचे", "आमच्या", "तुमचा", "तुमची", "तुमचे", "तुमच्या",
  "आपला", "आपली", "आपले", "आपल्या", "हा", "ही", "हे", "ह्या", "या", "यांनी", "त्यांनी",
  "मला", "तुला", "त्याला", "तिला", "आम्हाला", "तुम्हाला", "आपल्याला",
  "काय", "कसा", "कशी", "कसे", "कशा", "कसं", "कधी", "कुठे", "कोठे", "किती", "कशासाठी",
  "झाला", "झाली", "झाले", "झाल्या", "गेला", "गेली", "गेले", "गेल्या",
  "आलो", "आले", "आली", "करणार", "करतो", "करते", "करतात", "करत", "केले", "केली", "केला",
  "पाहिजे", "हवा", "हवी", "हवे", "आणि", "पण", "परंतु", "म्हणून", "कारण", "जर", "तर", "की",
  "आहात", "कसेआहात", "छान", "मजेत", "सर्व", "मराठी", "येथे", "तेथे", "धन्यवाद", "नमस्कार", "खूप"
]);

const HINDI_WORDS = new Set([
  "है", "हैं", "था", "थी", "थे", "हूँ", "हुँ", "हो", "नहीं", "नही", "मत",
  "होगा", "होगी", "होंगे", "होना", "होने", "होती", "होता", "होते",
  "मैं", "मै", "तुम", "आप", "वह", "यह", "वे", "ये",
  "मुझे", "तुझे", "उसे", "इसे", "हमें", "तुम्हें", "उन्हें", "इन्हें",
  "मेरा", "मेरी", "मेरे", "तेरा", "तेरी", "तेरे", "उसका", "उसकी", "उसके",
  "इसका", "इसकी", "इसके", "हमारा", "हमारी", "हमारे", "आपका", "आपकी", "आपके",
  "उनका", "उनकी", "उनके", "इनका", "इनकी", "इनके", "उसने", "किसने",
  "क्या", "कौन", "कहाँ", "कहां", "कब", "क्यों", "कैसे", "कैसा", "कैसी", "कितना", "कितनी", "कितने",
  "किया", "दिया", "लिया", "हुआ", "हुई", "हुए", "सकता", "सकती", "सकते",
  "और", "लेकिन", "किन्तु", "परन्तु", "इसलिए", "क्योंकि", "चूंकि", "अगर", "यदि",
  "बहुत", "ज्यादा", "कम", "अच्छा", "अच्छी", "अच्छे", "हिंदी", "हिन्दी",
  "में", "पर", "से", "को", "का", "की", "के", "ने", "तक", "द्वारा", "लिए", "साथ", "पास", "वाला", "वाली", "वाले", "भी", "ही"
]);

const GERMAN_WORDS = new Set([
  "und", "der", "die", "das", "ein", "eine", "einer", "einem", "einen", "eines",
  "ist", "sind", "war", "waren", "nicht", "mit", "für", "fuer", "auf", "aus",
  "dem", "den", "des", "dass", "daß", "sie", "wir", "ich", "du", "er", "es",
  "wie", "oder", "aber", "wenn", "auch", "als", "nach", "zu", "im", "in", "am",
  "von", "durch", "über", "ueber", "unter", "vor", "sehr", "mehr", "haben", "hat",
  "hatte", "hatten", "werden", "wurde", "können", "kann", "hallo", "guten",
  "morgen", "tag", "abend", "danke", "bitte", "ja", "nein", "deutsch", "deutschland"
]);

const ENGLISH_WORDS = new Set([
  "the", "is", "are", "was", "were", "and", "to", "in", "that", "it", "for",
  "on", "with", "as", "this", "at", "by", "an", "be", "have", "has", "had",
  "from", "or", "you", "we", "they", "my", "your", "his", "her", "their", "our",
  "which", "not", "but", "what", "all", "when", "there", "can", "will", "more",
  "about", "hello", "good", "morning", "evening", "thank", "thanks", "english", "today"
]);

const evaluateHindiVsMarathi = (cleanText, tokens) => {
  if (MARATHI_CHAR_REGEX.test(cleanText)) {
    return { marathiScore: 10, hindiScore: 0, hasMarathiChar: true };
  }

  let marathiScore = 0;
  let hindiScore = 0;

  tokens.forEach((t) => {
    if (MARATHI_WORDS.has(t)) {
      marathiScore += 2;
    }
    if (HINDI_WORDS.has(t)) {
      hindiScore += 2;
    }

    if (/(ंमध्ये|साठी|वरून|बद्दल|मुळे|कडे|तील|तून|पेक्षा|प्रमाणे)$/.test(t)) {
      marathiScore += 1.5;
    }
    if (/(एगा|एगी|एंगे|ऊंगा|ऊंगी)$/.test(t)) {
      hindiScore += 1.5;
    }
  });

  return { marathiScore, hindiScore, hasMarathiChar: false };
};

export const validateTextMatchesLanguage = (text, selectedLanguage) => {
  if (!text || !text.trim()) {
    return { isValid: true, error: null };
  }

  const cleanText = text.trim();
  const devanagariMatches = cleanText.match(DEVANAGARI_REGEX) || [];
  const latinMatches = cleanText.match(LATIN_REGEX) || [];

  const devCount = devanagariMatches.length;
  const latinCount = latinMatches.length;

  const DEFAULT_ERROR = "The entered text does not match the selected language. Please select the correct language.";

  if (devCount === 0 && latinCount === 0) {
    return { isValid: true, error: null };
  }

  const isPrimaryDevanagari = devCount > 0 && devCount >= latinCount;
  const isPrimaryLatin = latinCount > 0 && latinCount > devCount;
  const tokens = cleanText.toLowerCase().split(/[\s,.;:!?()"'«»\-\+\/\\]+/).filter(Boolean);

  if (selectedLanguage === "English") {
    if (isPrimaryDevanagari || devCount > latinCount * 0.3) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    if (GERMAN_CHAR_REGEX.test(cleanText)) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    let germanScore = 0;
    let englishScore = 0;
    tokens.forEach((t) => {
      if (GERMAN_WORDS.has(t)) germanScore++;
      if (ENGLISH_WORDS.has(t)) englishScore++;
    });
    if (germanScore > englishScore && germanScore >= 2 && englishScore === 0) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    return { isValid: true, error: null };
  }

  if (selectedLanguage === "German") {
    if (isPrimaryDevanagari || devCount > latinCount * 0.3) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    return { isValid: true, error: null };
  }

  if (selectedLanguage === "Hindi") {
    if (isPrimaryLatin || latinCount > devCount * 0.3) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    const { marathiScore, hindiScore } = evaluateHindiVsMarathi(cleanText, tokens);
    if (marathiScore > 0 && marathiScore > hindiScore) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    return { isValid: true, error: null };
  }

  if (selectedLanguage === "Marathi") {
    if (isPrimaryLatin || latinCount > devCount * 0.3) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    const { marathiScore, hindiScore } = evaluateHindiVsMarathi(cleanText, tokens);
    if (hindiScore > 0 && hindiScore > marathiScore) {
      return { isValid: false, error: DEFAULT_ERROR };
    }
    return { isValid: true, error: null };
  }

  return { isValid: true, error: null };
};

export const validateTTSRequest = ({ text, language, voice }) => {
  if (!text || !text.trim()) {
    return "Text is required.";
  }

  if (text.length > 5000) {
    return "Text must not exceed 5000 characters.";
  }

  if (!language || !SUPPORTED_LANGUAGES[language]) {
    return "Unsupported language selected. Please select English, Hindi, Marathi, or German.";
  }

  if (!voice) {
    return "Voice is required.";
  }

  const vLower = voice.toLowerCase();
  const isValidVoice =
    SUPPORTED_LANGUAGES[language].includes(voice) ||
    vLower.includes("female") ||
    vLower.includes("male");

  if (!isValidVoice) {
    return `Voice '${voice}' is not valid for language '${language}'.`;
  }

  const langMatch = validateTextMatchesLanguage(text, language);
  if (!langMatch.isValid) {
    return langMatch.error;
  }

  return null;
};

export { SUPPORTED_LANGUAGES };
