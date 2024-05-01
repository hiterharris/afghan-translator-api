const log = (user, req, res) => {
    console.log('tracking: ', { user, data: { req, res } });
}

module.exports = log;