
const checkRequestBody = (req, res, next) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({
            error: {
                message: 'Please enter the text to translate.',
            },
        });
    }
    next();
}

module.exports = {  checkRequestBody };
