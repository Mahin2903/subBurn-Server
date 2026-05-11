import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const burnSubtitles = (videoPath, subtitlePath) => {
  return new Promise((resolve, reject) => {
    // Create rendered folder
    if (!fs.existsSync("rendered")) {
      fs.mkdirSync("rendered");
    }

    // Output video
    const outputPath = path.join("rendered", `${Date.now()}-captioned.mp4`);

    // Linux-safe subtitle path
    const absoluteSubtitlePath = path
      .resolve(subtitlePath)
      .replace(/\\/g, "/")
      .replace(/:/g, "\\:")
      .replace(/'/g, "\\'")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]");

    console.log("Subtitle path:", absoluteSubtitlePath);

    ffmpeg(videoPath)
      .videoCodec("libx264")
      .audioCodec("aac")

      .outputOptions(["-preset veryfast", "-crf 23"])

      // IMPORTANT
      .videoFilters(`subtitles='${absoluteSubtitlePath}'`)

      .on("start", (cmd) => {
        console.log("FFmpeg command:");
        console.log(cmd);
      })

      .on("stderr", (stderrLine) => {
        console.log(stderrLine);
      })

      .on("end", () => {
        console.log("Subtitles burned successfully");

        resolve(outputPath);
      })

      .on("error", (err, stdout, stderr) => {
        console.log("===== FFMPEG STDERR =====");
        console.log(stderr);

        console.log("===== FFMPEG ERROR =====");
        console.log(err);

        reject(err);
      })

      .save(outputPath);
  });
};
