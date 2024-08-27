const router = require("express").Router();
const config = require("../config");
const { openai, apiKey } = config;
const { prompts } = require('../constants');
const { responseHeaders, checkRequestBody, logger, blacklist } = require('../middleware');
const fs = require('fs');
const path = require('path');

router.use(responseHeaders);

const tts = async (text) => {
    const parsedText = JSON.parse(text);
    console.log('parsedText: ', parsedText.latin);

    const speechFile = path.resolve("./speech.mp3");
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: parsedText.latin
      });
      
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
}

router.post("/", checkRequestBody, async (req, res) => {
    blacklist(req, res);
    const { gpt4o } = prompts(req, res);

    if (!apiKey) {
        res.status(500).json({
            error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
        });
        return;
    }

    try {
        const response = await openai.chat.completions.create({
            messages: gpt4o,
            model: "gpt-4o",
            temperature: 0,
            response_format: { type: "json_object" },
          });
        const result = response?.choices[0]?.message?.content || '';
        tts(result);

        logger.info({
            request: req.body.text,
            response: JSON.parse(result),
        });
        res.status(200).json(result);
    } catch (error) {
        if (error.response) {
            logger.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            logger.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
});

module.exports = router;
