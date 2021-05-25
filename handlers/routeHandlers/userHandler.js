//dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');

//scafolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedRequest = ['get', 'post', 'put', 'delete'];
    if(acceptedRequest.indexOf(requestProperties.method) > -1) {
        // console.log(requestProperties.method);
        handler._users[requestProperties.method](requestProperties, callback);
    }else{
        callback(405);
    }
};

//another scafolding
handler._users = {};

handler._users.get = (requestProperties, callback) => {
    // console.log(requestProperties.QueryStringObject.phone);
    //checking the number is valid or not found
    const phone = typeof(requestProperties.QueryStringObject.phone) === 'string' && requestProperties.QueryStringObject.phone.trim().length === 11 ? requestProperties.QueryStringObject.phone : false;
    if(phone) {
        //looking for the user
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };
            if(!err && user) {
                delete user.password;
                callback(200, user);
            }else{
                callback(404, {
                    error : "User not found",
                })
            }
        })
    }else{
        callback(404, {
            error : "User not found again",
        });
    }
}

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' &&  requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement ? requestProperties.body.tosAgreement : false;

    if(firstName && lastName && phone && password && tosAgreement){
        // console.log(firstName, lastName, phone, password, tosAgreement);
        //making sure that the user doesn't exist
        data.read('users', phone, (err) => {
            if(err){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : hash(password),
                    tosAgreement,
                };
                //store the user to db
                // console.log(userObject);
                data.create('users', phone, userObject, (err2) => {
                    if(err2){
                        callback(200, {
                            message: 'User created successfully',
                        });
                    }else{
                        callback(500, {
                            error : 'File are not created',
                        });
                    }
                });
            }else{
                callback(500, {
                    error : 'There was an error with server side',
                })
            }
        })
    }else{
        callback(400, {
            error : "You have a problem with request"
        });
    }
};


handler._users.put = (requestProperties, callback) => {

    //checking the validity
    const firstName = typeof(requestProperties.body.firstName) === 'string' &&  requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone){
        if(firstName || lastName || password){
            //looking up for user in db
            data.read('users', phone, (err, uData) => {
                const userData = { ...parseJSON(uData)};
                if(!err && userData){
                    if(firstName){
                        userData.firstName = firstName; 
                    }
                    if(lastName){
                        userData.lastName = lastName;firstName; 
                    }
                    if(password){
                        userData.password = hash(password);
                    }
                    //store data to db
                    data.update('users', phone, userData, (err) => {
                        if(!err){
                            callback(200, {message : 'User updated successfully'});
                        }else{
                            callback(400, {error: 'There is an error with the server side'});
                        }
                    });
                }
            })
        }else{
            callback(400, {
                error : 'You have to provide at least one field',
            })
        }
    }else{
        callback(400, {
            error : 'You must provide valid data',
        });
    }

}

handler._users.delete = (requestProperties, callback) => {
    const phone = typeof(requestProperties.QueryStringObject.phone) === 'string' && requestProperties.QueryStringObject.phone.trim().length === 11 ? requestProperties.QueryStringObject.phone : false;
    if(phone){
        data.read('users', phone, (err, userData) => {
            if(!err && userData){
                data.delete('users', phone, (err) => {
                    if(!err){
                        callback(200, {message : 'User deleted successfully'});
                    }else{
                        callback(400, {error : 'user cannot be deleted'});
                    }
                });
            }else{
                callback(500, {error : 'error occured deleting user'});
            }
        });
    }else{
        callback(400, {
            error : 'You put the wrong phone number',
        })
    }
}

//export modules
module.exports = handler;