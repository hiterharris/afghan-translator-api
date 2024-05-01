const log = (request, response) => {
    console.log('tracking: ', { data: { request, response } });
}

module.exports = log;