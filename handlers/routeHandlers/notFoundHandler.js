const handler = {};

handler.notFoundHandle = (requestProperties, callback) => {
    callback(404, {
        message: 'Url not found',
    });
};

module.exports = handler;