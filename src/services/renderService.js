import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

// Use system FFmpeg (installed via apt in Dockerfile), NOT ffmpeg-static
ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");

export const burnSubtitles = (videoPath, subtitlePath) => {
  return new Promise((resolve, reject) => {

    if (!fs.existsSync("rendered")) {
      fs.mkdirSync("rendered");
    }

    const outputPath = path.join("rendered", `${Date.now()}-captioned.mp4`);

    const absoluteSubtitlePath = path.resolve(subtitlePath).replace(/\\/g, "/");

    ffmpeg(videoPath)

      .videoFilters(
        `subtitles='${absoluteSubtitlePath}':force_style='FontName=Noto Sans Bengali,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2'`
      )

      .outputOptions(["-c:v libx264", "-c:a aac"])

      .on("start", (cmd) => console.log("FFmpeg command:", cmd))

      .on("end", () => {
        console.log("Subtitles burned successfully");
        resolve(outputPath);
      })

      .on("error", (err, stdout, stderr) => {
        console.log("FFmpeg stderr:", stderr); // shows exact ffmpeg error
        reject(err);
      })

      .save(outputPath);
  });
};