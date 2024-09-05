require('dotenv').config();
const router = require("express").Router();
const fs = require('fs');
const { responseHeaders, logger } = require('../middleware');

router.use(responseHeaders);

const apiKey = process.env.ELEVEN_LABS_API_KEY;

const getVoices = async () => {
  const options = {
    method: 'GET',
    headers: {
      'xi-api-key': apiKey
    }
  };

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', options);
    const rawText = await response.text();

    const data = JSON.parse(rawText);
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
    return [];
  }
}

if (!apiKey) {
  res.status(500).json({
    error: { message: "ElevenLabs key not configured" }
  });
  return;
}

router.post("/", async (req, res) => {
  logger.info({
    request: req.body.text,
  });

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'The "text" field is required.' });
  }

  try {
    const voices = await getVoices();
    const voice = voices.find(voice => voice.voice_id === 'BognUUMX6W1qmZKB2TOw');
    const voiceId = voice ? voice.voice_id : 'Bill';

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const payload = {
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.3,
        style: 0.2,
      }
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(payload)
    };

    const speechResponse = await fetch(url, options);

    logger.info({ speechResponse });

    if (!speechResponse.ok) {
      const errorText = await speechResponse.text();
      throw new Error(`HTTP error! status: ${speechResponse.status}, response: ${errorText}`);
    }

    const arrayBuffer = await speechResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="output.mp3"',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
    logger.info('Speech generation successful!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
