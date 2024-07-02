const router = require("express").Router();
const config = require("../config");
const { configuration, openai } = config;
const logger = require("../logger");
const db = require('../data/db-config');
const prompts = require('../constants');
const { checkRequestBody } = require('../middleware');

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

router.post("/", checkRequestBody, async (req, res) => {
    const { messagesEnglish, messagesDari } = prompts(req, res);
    const inputLanguage = req.body.language || 'English';

    if (!configuration.apiKey) {
        res.status(500).json({
            error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
        });
        return;
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: inputLanguage === 'English' ? messagesEnglish : messagesDari,
            temperature: 0,
            max_tokens: 256,
        });
        const result = response?.data?.choices[0]?.message?.content;
        db.insert({
            request_language: inputLanguage, 
            request_text: req.body.text,
            response_latin: JSON.parse(result)?.latin,
            response_arabic: JSON.parse(result)?.arabic
        });
        logger.info({
            request: req.body.text,
            response: JSON.parse(result)
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
