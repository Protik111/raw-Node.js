//dependencies
const {handleSample} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');

const routes = {
    sample : handleSample,
    user : userHandler,
    token : tokenHandler
    // about : handleSample
}

module.exports = routes;