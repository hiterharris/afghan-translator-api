const os = require('os');
const axios = require('axios');

async function gatherUserInfo() {
    const userInfo = {
        username: os.userInfo().username,
        osType: os.type(),
        osPlatform: os.platform(),
        osArch: os.arch(),
        osRelease: os.release(),
        nodeVersion: process.version
    };

    try {
        const ipInfoResponse = await axios.get('http://ip-api.com/json');
        const ipInfo = ipInfoResponse.data;

        userInfo.country = ipInfo.country;
        userInfo.region = ipInfo.regionName;
        userInfo.city = ipInfo.city;
        userInfo.latitude = ipInfo.lat;
        userInfo.longitude = ipInfo.lon;
        userInfo.ip = ipInfo.query;
        userInfo.language = ipInfo.countryCode;
    } catch (error) {
        console.error('Error fetching IP information:', error.message);
    }

    return userInfo;
}

const user = gatherUserInfo();

module.exports = user;
