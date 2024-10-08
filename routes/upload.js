require('dotenv').config();
const router = require("express").Router();
const config = require("../config");
const { openai, apiKey } = config;
const { logger } = require('../middleware');
const { prompts } = require('../constants/prompts');

router.post("/", async (req, res) => {
    const { imagePrompt } = prompts(req, res);

    if (!apiKey) {
        res.status(500).json({
            error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
        });
        return;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: imagePrompt
        });

        const result = response.choices[0].message.content;

        logger.info({
            request: req.body,
            response: result,
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
