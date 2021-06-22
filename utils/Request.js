const { default: axios } = require("axios"),
config = require("../config"),
randomUserAgent = require("random-useragent");

module.exports = axios.create({
    baseURL: config.baseURL,
    headers: {
        "user-agent": randomUserAgent.getRandom()
    }
});