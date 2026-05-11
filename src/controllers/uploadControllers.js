import { extractAudio } from "../services/audioService.js";
import { transcribeAudio } from "../services/transcriptionService.js";
import { burnSubtitles } from "../services/renderService.js";

export const uploadVideo = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video uploaded",
      });
    }

    // Uploaded video path
    const videoPath = req.file.path;

    // Extract audio
    const audioPath = await extractAudio(videoPath);
    const subtitles = await transcribeAudio(audioPath);

    const renderedVideo = await burnSubtitles(videoPath, subtitles);

    // Success response
    res.status(200).json({
      success: true,
      message: "Video uploaded and audio extracted",

      video: {
        filename: req.file.filename,
        path: videoPath,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },

      audio: {
        path: audioPath,
      },
      subtitles,
      rendered: {
        path: renderedVideo,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
