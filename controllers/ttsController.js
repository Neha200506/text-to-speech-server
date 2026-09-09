export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Text-to-Speech API is running",
  });
};
