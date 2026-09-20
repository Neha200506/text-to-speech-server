import { spawn } from "child_process";

const PYTHON_SCRIPT = "services/edgeTts.py";

export const generateSpeech = async ({
  text,
  language,
  voice,
}) => {
  const selectedLanguage = language || "English";
  const selectedVoice = voice || "Female Voice";

  console.log("------------------ TTS REQUEST ------------------");
  console.log(`[DEV-LOG] Selected Language: ${selectedLanguage}`);
  console.log(`[DEV-LOG] Selected Voice: ${selectedVoice}`);

  // Validate text
  if (!text || !text.trim()) {
    throw new Error("Text cannot be empty.");
  }

  // Limit text length
  if (text.trim().length > 5000) {
    throw new Error("Text cannot contain more than 5000 characters.");
  }

  const inputData = JSON.stringify({
    text: text.trim(),
    language: selectedLanguage,
    voice: selectedVoice,
  });

  try {
    const audioBase64 = await runPythonTTS(inputData);

    if (!audioBase64 || audioBase64.length === 0) {
      throw new Error("Received empty audio response from Python TTS.");
    }

    console.log(
      `[DEV-LOG] Successfully generated audio. Base64 length: ${audioBase64.length}`
    );

    console.log("-------------------------------------------------");

    return {
      text: text.trim(),
      language: selectedLanguage,
      voice: selectedVoice,
      audio: `data:audio/mpeg;base64,${audioBase64}`,
    };
  } catch (error) {
    console.error(`[DEV-LOG] TTS Error: ${error.message}`);

    console.log("-------------------------------------------------");

    throw new Error(`Edge TTS Error: ${error.message}`);
  }
};


const runPythonTTS = (inputData) => {
  return new Promise((resolve, reject) => {
    // Use python on Windows
    const pythonProcess = spawn("python", [
      PYTHON_SCRIPT,
    ]);

    let output = "";
    let errorOutput = "";

    // Send JSON input to Python
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    // Collect Python output
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Collect Python errors
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    // Handle process errors
    pythonProcess.on("error", (error) => {
      reject(
        new Error(
          `Unable to start Python TTS: ${error.message}`
        )
      );
    });

    // Handle process completion
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            errorOutput.trim() ||
              `Python process exited with code ${code}`
          )
        );
        return;
      }

      if (errorOutput.trim()) {
        console.log(errorOutput.trim());
      }
      
      try {
        const result = JSON.parse(output);

        if (!result.audio) {
          reject(
            new Error("Python did not return audio data.")
          );
          return;
        }

        resolve(result.audio);
      } catch (error) {
        reject(
          new Error(
            `Invalid response from Python TTS: ${error.message}`
          )
        );
      }
    });
  });
};
