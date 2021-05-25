//dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const {notFoundHandle} = require('../handlers/routeHandlers/notFoundHandler');
const routes = require('../routes');
const {parseJSON} = require('../helpers/utilities');


//module scafolding
const handler = {};

handler.handleReqRes = (req, res) => {
    //getting the url and parsing it
    const parsedUrl = url.parse(req.url);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/|\/$/g, '');
    const method = req.method.toLowerCase();
    const QueryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        QueryStringObject,
        headersObject,
    };


    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandle;



    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
    
            const payloadString = JSON.stringify(payload);
    
            // return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        // res.end('I am responding again');
    })

    // console.log(headersObject);
    // console.log(method);
    // console.log(trimmedPath);
};

module.exports = handler;