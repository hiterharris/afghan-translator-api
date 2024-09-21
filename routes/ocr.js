const router = require("express").Router();
const config = require("../config");
const { openai, apiKey } = config;
const { ocrPrompt } = require('../constants/prompts');
const { responseHeaders, checkRequestBody, logger, blacklist } = require('../middleware');

router.use(responseHeaders);

router.post("/", checkRequestBody, async (req, res) => {
    blacklist(req, res);
    console.log('req.body', req.body);
    const { imageUrl } = req.body;
    const { prompt } = ocrPrompt(imageUrl);

    if (!apiKey) {
        res.status(500).json({
            error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
        });
        return;
    }


    if (!imageUrl) {
        return res.status(400).json({
            error: { message: "No image provided. Please provide a base64-encoded image in the request body." }
        });
    }

    console.log('imageUrl', imageUrl);

    try {
        const response = await openai.chat.completions.create({
            messages: prompt,
            model: "gpt-4o",
            response_format: { type: "text" } // { type: "json_object" }
            // temperature: 0,
          });

        const result = response?.choices[0]?.message?.content || '';

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
