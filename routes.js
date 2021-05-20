//dependencies
const {handleSample} = require("./handlers/routeHandlers/sampleHandler");
const routes = {
    sample : handleSample,
    // about : handleSample
}

module.exports = routes;