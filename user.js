const os = require('os');
const axios = require('axios');

// Function to gather user information
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
        userInfo.language = ipInfo.countryCode; // Assuming countryCode represents language
    } catch (error) {
        console.error('Error fetching IP information:', error.message);
    }

    return userInfo;
}

// Display user information
function displayUserInfo(userInfo) {
    console.log('User Information:');
    console.log('-----------------');
    console.log('Username:', userInfo.username);
    console.log('Operating System Type:', userInfo.osType);
    console.log('Platform:', userInfo.osPlatform);
    console.log('Architecture:', userInfo.osArch);
    console.log('Release:', userInfo.osRelease);
    console.log('Node.js Version:', userInfo.nodeVersion);
    console.log('Country:', userInfo.country);
    console.log('Region:', userInfo.region);
    console.log('City:', userInfo.city);
    console.log('Latitude:', userInfo.latitude);
    console.log('Longitude:', userInfo.longitude);
    console.log('IP Address:', userInfo.ip);
    console.log('Language:', userInfo.language);
}

// Main function
async function main() {
    const userInfo = await gatherUserInfo();
    displayUserInfo(userInfo);
}

// Execute the main function
main();
