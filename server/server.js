const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const util = require("util");
const textToSpeech = require("@google-cloud/text-to-speech");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/audio", express.static(path.join(__dirname, "audio"))); // serve audio files

const client = new textToSpeech.TextToSpeechClient();

// TTS Route
app.post("/api/tts", async (req, res) => {
  const { text, lang, ssml } = req.body;

  try {
    const request = {
      input: ssml ? { ssml: text } : { text },
      voice: { languageCode: lang || "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);
    const fileName = `audio/output_${Date.now()}.mp3`;
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(fileName, response.audioContent, "binary");

    res.json({ success: true, file: `/${fileName}` });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// Quiz Route (example questions)
const QUIZ_QUESTIONS = [
  {
    id: 1,
    language: "Arabic",
    type: "mcq",
    question: "Choose the correct pronunciation for: السَّلَامُ",
    options: ["as-salamu", "assalam", "salamu"],
    answer: "as-salamu",
  },
  {
    id: 2,
    language: "English",
    type: "typing",
    question: "Type what you hear",
    audio: "/audio/hello.mp3",
    answer: "hello",
  },
];

app.get("/api/quiz", (req, res) => {
  res.json(QUIZ_QUESTIONS);
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
