//dependencies
const {handleSample} = require("./handlers/routeHandlers/sampleHandler");
const {userHandler} = require("./handlers/routeHandlers/userHandler");

const routes = {
    sample : handleSample,
    user : userHandler,
    // about : handleSample
}

module.exports = routes;