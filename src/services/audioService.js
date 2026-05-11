import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

import path from "path";
import fs from "fs";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Create audio folder automatically
const audioFolder = "audio";

if (!fs.existsSync(audioFolder)) {
  fs.mkdirSync(audioFolder, { recursive: true });
}

// Extract audio function
export const extractAudio = (videoPath) => {
  return new Promise((resolve, reject) => {

    // Get filename without extension
    const fileName = path.parse(videoPath).name;

    // Output audio path
    const audioPath = `audio/${fileName}.mp3`;

    ffmpeg(videoPath)

      // No video
      .noVideo()

      // Audio format
      .audioCodec("libmp3lame")

      // Save output
      .save(audioPath)

      // Success
      .on("end", () => {
        console.log("Audio extracted successfully");

        resolve(audioPath);
      })

      // Error
      .on("error", (error) => {
        console.log("FFmpeg Error:", error);

        reject(error);
      });
  });
};