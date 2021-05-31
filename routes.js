//dependencies
const {handleSample} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');
const {checkHandler} = require('./handlers/routeHandlers/checkHandler');

const routes = {
    sample : handleSample,
    user : userHandler,
    token : tokenHandler,
    check : checkHandler,
    // about : handleSample
}

module.exports = routes;