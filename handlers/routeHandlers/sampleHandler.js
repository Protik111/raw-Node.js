const handler = {};

handler.handleSample = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(200, {
        message: 'This is url',
    });
};

module.exports = handler;