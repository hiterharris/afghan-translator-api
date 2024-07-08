require('dotenv').config();
const OpenAIApi = require("openai");

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({ apiKey });
const config = { openai, apiKey };

module.exports = config;
