export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Text-to-Speech API is running",
  });
};

export const testTTS = (req, res) => {
  const { text, language, voice } = req.body;

  res.status(200).json({
    success: true,
    message: "TTS request received successfully",
    data: {
      text,
      language,
      voice,
    },
  });
};
