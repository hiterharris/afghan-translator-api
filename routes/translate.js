const router = require("express").Router();
const config = require("../config");
const { configuration, openai } = config;
const log = require("../logging");

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

router.post("/", async (req, res) => {
    const text = req.body.text || '';
    const inputLanguage = req.body.language || 'English';

    const messagesEnglish = [
        {
            role: "system",
            content: `You are from Kabul, Afghanistan and fluent in English and Dari as spoken in Kabul. You will be provided with a sentence in English, and your task is to translate it into Afghan Dari.  Your response will follow the list of guidelines below:
            1. Your response will be in the format of an json object in this format: { latin: "Latin alphabet translation", arabic: "Arabic alphabet translation" }.
            2. Do not use Persian or Farsi dialects for your translations.
            3. Do not use any other language than Dari.
            4. Use "ma" instead of "man" for "I".
            5. Use "wa" instead of "va" as the translation for the word "and".
            `
          },
          {
            role: "user",
            content: text
          }
    ];

    const messagesDari = [
        {
            role: "system",
            content: `You are from Kabul, Afghanistan and fluent in English and Dari as spoken in Kabul. You will be provided with a sentence in Dari, and your task is to translate it into American English. Your response will provide only the Latin alphabet translation. Do not use Persian or Farsi dialects for your translations. Your response will follow the list of guidelines below:
            1. Your response will be in the format of an json object in this format: { latin: "Latin alphabet translation" }.
            `
        },
        {
            role: "user",
            content: text
        },
    ];

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
        res.status(200).json(result);
        log(text, result);
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
});

module.exports = router;
