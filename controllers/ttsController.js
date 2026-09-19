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
    let errorMessage = error.message || "Failed to process TTS request.";

    if (error.response?.data) {
      const errorData = error.response.data;

      if (Buffer.isBuffer(errorData)) {
        errorMessage = errorData.toString("utf8");
      } else if (typeof errorData === "object") {
        errorMessage = errorData.message || errorData.error?.message || JSON.stringify(errorData);
      } else {
        errorMessage = String(errorData);
      }
    }

    console.error("TTS error:", errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
