import { exec } from "child_process";

export const transcribeAudio = (audioPath) => {

  return new Promise((resolve, reject) => {

    const command =
      `python transcribe.py ${audioPath}`;

    exec(command, (error, stdout, stderr) => {

      if (error) {
        console.log("Python Error:", error);
        reject(error);
        return;
      }

      if (stderr) {
        console.log("Python stderr:", stderr);
      }

      // Subtitle path returned from Python
      const subtitlePath = stdout.trim();

      resolve(subtitlePath);
    });
  });
};