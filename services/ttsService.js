import axios from "axios";

const OPENROUTER_TTS_URL =
  "https://openrouter.ai/api/v1/audio/speech";

const DEFAULT_MODEL =
  "fish-audio/s2.1-pro-free:free";

export const generateSpeech = async ({
  text,
  language,
  voice,
}) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenRouter API key is missing from environment variables."
    );
  }

  const selectedLanguage = language || "English";
  const selectedVoice = voice || "Female Voice";

  // Development logs
  console.log("------------------ TTS REQUEST ------------------");
  console.log(
    `[DEV-LOG] Selected Language: ${selectedLanguage}`
  );
  console.log(
    `[DEV-LOG] Selected Voice: ${selectedVoice}`
  );

  // Validate text
  if (!text || !text.trim()) {
    throw new Error("Text cannot be empty.");
  }

  // Limit text length
  if (text.trim().length > 5000) {
    throw new Error(
      "Text cannot contain more than 5000 characters."
    );
  }

  /*
   * Fish Audio does not use OpenAI preset voices
   * such as "alloy", "nova", or "shimmer".
   *
   * Therefore, the voice field is intentionally omitted.
   * The provider will use its default voice.
   *
   * IMPORTANT:
   * Selecting Male Voice or Female Voice in the UI
   * does not automatically change the generated voice.
   * A provider-supported voice reference is required
   * for genuine male/female voice selection.
   */

  const payload = {
    model: DEFAULT_MODEL,
    input: text.trim(),
    response_format: "mp3",
  };

  console.log(
    "[DEV-LOG] Request Payload:",
    JSON.stringify(payload)
  );

  try {
    const response = await axios.post(
      OPENROUTER_TTS_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: 15000,
      }
    );

    console.log(
      `[DEV-LOG] Provider Response Status: ${response.status}`
    );

    // Check whether audio was returned
    if (
      !response.data ||
      response.data.byteLength === 0
    ) {
      throw new Error(
        "Received empty audio response from TTS provider."
      );
    }

    // Convert audio buffer to Base64
    const audioBase64 = Buffer.from(
      response.data
    ).toString("base64");

    console.log(
      `[DEV-LOG] Successfully generated audio. Buffer size: ${response.data.byteLength} bytes`
    );

    console.log(
      "-------------------------------------------------"
    );

    // Return generated speech data
    return {
      text: text.trim(),
      language: selectedLanguage,

      // Return the voice selected by the user in the UI
      voice: selectedVoice,

      audio: `data:audio/mpeg;base64,${audioBase64}`,
    };
  } catch (error) {
    const status =
      error.response?.status || "UNKNOWN_STATUS";

    let providerErrMsg = error.message;

    // Read provider error response
    if (error.response?.data) {
      try {
        const parsed = JSON.parse(
          Buffer.from(
            error.response.data
          ).toString("utf8")
        );

        providerErrMsg =
          parsed.error?.message ||
          parsed.message ||
          providerErrMsg;
      } catch (parseError) {
        providerErrMsg = Buffer.from(
          error.response.data
        ).toString("utf8");
      }
    }

    console.error(
      `[DEV-LOG] Provider Response Status: ${status}`
    );

    console.error(
      `[DEV-LOG] Provider Error Message: ${providerErrMsg}`
    );

    console.log(
      "-------------------------------------------------"
    );

    throw new Error(
      `OpenRouter TTS Error (${status}): ${providerErrMsg}`
    );
  }
};