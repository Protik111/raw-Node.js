//dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON, stringGenerator} = require('../../helpers/utilities');
const tokenHandler = require('../routeHandlers/tokenHandler');

//scafolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedRequest = ['get', 'post', 'put', 'delete'];
    if(acceptedRequest.indexOf(requestProperties.method) > -1) {
        // console.log(requestProperties.method);
        handler._check[requestProperties.method](requestProperties, callback);
    }else{
        callback(405);
    }
};

//another scafolding
handler._check = {};

handler._check.post = (requestProperties, callback) => {
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;

    if(protocol && url && method && successCodes && timeOutSeconds){
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        
        //data read from db
        data.read('tokens' , token, (err, tokenData) => {
            if(!err && tokenData){
                let userPhone = parseJSON(tokenData).phone;

                //look up the user data with phone from userPhone variable
                data.read('users', userPhone, (err, userData) => {
                    if(!err && userData){
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if(tokenIsValid){
                                let userObject = parseJSON(userData);
                                let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                if(userChecks.length < 5){
                                    let checkId = stringGenerator(20);
                                    let checkObject = {
                                        id : checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeOutSeconds
                                    };
                                    //save the object
                                    data.create('checks', checkId, checkObject, (err) => {
                                        if(!err){
                                             // add check id to the user's object
                                             userObject.checks = userChecks;
                                             userObject.checks.push(checkId);
                                             
                                                 // save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    // return the data about the new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error:
                                                            'There was a problem in the server side!',
                                                    });
                                                }
                                            });
                                        }else{
                                            callback(500, {error : 'Server side error'});
                                        }
                                    });
                                }else{
                                    callback(401 , {error : 'Not Allowed'});
                                }
                            }else{
                                callback(403, {error : 'Authentication Error'});
                            }
                        });
                    }else{
                        callback(403, {error : 'User not found'});
                    }
                })
            }else{
                callback(403, {error : 'You have authentication problem'});
            }
        })
    }else{
        callback(400, {error : 'You have a problem with your input'});
    }
}

handler._check.get = (requestProperties, callback) => {
    const id = typeof(requestProperties.QueryStringObject.id) === 'string' && requestProperties.QueryStringObject.id.trim().length === 30 ? requestProperties.QueryStringObject.id : false;

    console.log('Id is :', id); // it will return false because we have a problem with QueryStringObject

    if (id) {
        // lookup the check
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(
                    token,
                    parseJSON(checkData).userPhone,
                    (tokenIsValid) => {
                        if (tokenIsValid) {
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(403, {
                                error: 'Authentication failure!',
                            });
                        }
                    }
                );
            } else {
                callback(500, {
                    error: 'You have a problem in your request',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};


handler._check.put = (requestProperties, callback) => {
    const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 30
        ? requestProperties.body.id
        : false;

// validate inputs
const protocol =
    typeof requestProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
        ? requestProperties.body.protocol
        : false;

const url =
    typeof requestProperties.body.url === 'string' &&
    requestProperties.body.url.trim().length > 0
        ? requestProperties.body.url
        : false;

const method =
    typeof requestProperties.body.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
        ? requestProperties.body.method
        : false;

const successCodes =
    typeof requestProperties.body.successCodes === 'object' &&
    requestProperties.body.successCodes instanceof Array
        ? requestProperties.body.successCodes
        : false;

const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === 'number' &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
        ? requestProperties.body.timeoutSeconds
        : false;

if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const checkObject = parseJSON(checkData);
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        if (protocol) {
                            checkObject.protocol = protocol;
                        }
                        if (url) {
                            checkObject.url = url;
                        }
                        if (method) {
                            checkObject.method = method;
                        }
                        if (successCodes) {
                            checkObject.successCodes = successCodes;
                        }
                        if (timeoutSeconds) {
                            checkObject.timeoutSeconds = timeoutSeconds;
                        }
                        // store the checkObject
                        data.update('checks', id, checkObject, (err2) => {
                            if (!err2) {
                                callback(200, {message : 'check object updated successfully'});
                            } else {
                                callback(500, {
                                    error: 'There was a server side error!',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Authentication error!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in the server side!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You must provide at least one field to update!',
        });
    }
} else {
    callback(400, {
        error: 'You have a problem in your request',
    });
}
}

//we have a problem of QueryStringObject that's why it doesn't work
handler._check.delete = (requestProperties, callback) => {
    const id =
    typeof requestProperties.QueryStringObject.id === 'string' &&
    requestProperties.QueryStringObject.id.trim().length === 30
        ? requestProperties.QueryStringObject.id
        : false;

if (id) {
    // lookup the check
    data.read('checks', id, (err1, checkData) => {
        if (!err1 && checkData) {
            const token =
                typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false;

            tokenHandler._token.verify(
                token,
                parseJSON(checkData).userPhone,
                (tokenIsValid) => {
                    if (tokenIsValid) {
                        // delete the check data
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                data.read(
                                    'users',
                                    parseJSON(checkData).userPhone,
                                    (err3, userData) => {
                                        const userObject = parseJSON(userData);
                                        if (!err3 && userData) {
                                            const userChecks =
                                                typeof userObject.checks === 'object' &&
                                                userObject.checks instanceof Array
                                                    ? userObject.checks
                                                    : [];

                                            // remove the deleted check id from user's list of checks
                                            const checkPosition = userChecks.indexOf(id);
                                            if (checkPosition > -1) {
                                                userChecks.splice(checkPosition, 1);
                                                // resave the user data
                                                userObject.checks = userChecks;
                                                data.update(
                                                    'users',
                                                    userObject.phone,
                                                    userObject,
                                                    (err4) => {
                                                        if (!err4) {
                                                            callback(200);
                                                        } else {
                                                            callback(500, {
                                                                error:
                                                                    'There was a server side problem!',
                                                            });
                                                        }
                                                    }
                                                );
                                            } else {
                                                callback(500, {
                                                    error:
                                                        'The check id that you are trying to remove is not found in user!',
                                                });
                                            }
                                        } else {
                                            callback(500, {
                                                error: 'There was a server side problem!',
                                            });
                                        }
                                    }
                                );
                            } else {
                                callback(500, {
                                    error: 'There was a server side problem!',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Authentication failure!',
                        });
                    }
                }
            );
        } else {
            callback(500, {
                error: 'You have a problem in your request',
            });
        }
    });
} else {
    callback(400, {
        error: 'You have a problem in your request',
    });
}
};

//export modules
module.exports = handler;