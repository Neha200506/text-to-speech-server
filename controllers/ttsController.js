import { validateTTSRequest } from "../utils/validators.js";
import { generateSpeech } from "../services/ttsService.js";

export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Text-to-Speech API is running",
  });
};

export const testTTS = async (req, res) => {
  const { text, language, voice } = req.body;

  const validationError = validateTTSRequest({
    text,
    language,
    voice,
  });

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  try {
    const speechData = await generateSpeech({
      text,
      language,
      voice,
    });

    return res.status(200).json({
      success: true,
      message: "TTS request processed successfully",
      data: speechData,
    });
  } catch (error) {
    console.error("TTS service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process TTS request.",
    });
  }
};
