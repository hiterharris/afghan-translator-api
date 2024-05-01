const fs = require('fs');

const tracking = (user, req, res) => {
    console.log('tracking: ', { user, data: { req, res } });
}

module.exports = tracking;