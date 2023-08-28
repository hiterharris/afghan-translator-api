const router = require("express").Router();
const config = require("../config");
const { configuration, openai } = config;

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

router.post("/translate", async (req, res) => {
    const text = req.body.text || '';

    const messages = [
        { role: "system", content: 'You will be provided the content from a document. Use the text to create an html document that is formatted and style based on the context of the text. Then translate the English into Afghan Dari.  Return the new translated html document.' },
        { role: "user", content: text },
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
            messages: messages,
            temperature: 0,
            max_tokens: 1000,
        });
        const result = response?.data?.choices[0]?.message?.content;
        res.status(200).json(result);
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

router.post("/convert", async (req, res) => {
    const text = req.body.text || '';

    const messages = [
        { role: "system", content: 'Use the text to create an html document that is formatted and style based on the context of the text.' },
        { role: "user", content: text },
    ];

    if (!configuration.apiKey) {
        res.status(500).json({
            error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
        });
        return;
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0,
            max_tokens: 1000,
        });
        const result = response?.data?.choices[0]?.message?.content;
        res.status(200).json(result);
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
