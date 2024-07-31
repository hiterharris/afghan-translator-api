const router = require("express").Router();
const config = require("../config");
const { openai, apiKey } = config;
const prompts = require('../constants');
const { checkRequestBody, logger } = require('../middleware');

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

router.post("/", checkRequestBody, async (req, res) => {
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
