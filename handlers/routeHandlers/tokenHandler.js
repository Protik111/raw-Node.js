//dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const {stringGenerator} = require('../../helpers/utilities');

//scafolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedRequest = ['get', 'post', 'put', 'delete'];
    if(acceptedRequest.indexOf(requestProperties.method) > -1) {
        // console.log(requestProperties.method);
        handler._token[requestProperties.method](requestProperties, callback);
    }else{
        callback(405);
    }
};

//another scafolding
handler._token = {};

handler._token.get = (requestProperties, callback) => {
     //checking the id is valid or not found
     const id = typeof(requestProperties.QueryStringObject.id) === 'string' && requestProperties.QueryStringObject.id.trim().length === 30 ? requestProperties.QueryStringObject.id : false;
     if(id) {
         //looking for the user
         data.read('tokens', id, (err, tokenData) => {
             const token = { ...parseJSON(tokenData) };
             if(!err && token) {
                 callback(200, user);
             }else{
                 callback(404, {
                     error : "Token not found",
                 })
             }
         })
     }else{
         callback(404, {
             error : "Token not found again",
         });
     }
};

handler._token.post = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone && password){
        data.read('users', phone, (err, userData) =>{
            let hashedPassword = hash(password);
            if(hashedPassword === parseJSON(userData).password) {
                let tokenId = stringGenerator(20);
                let expires = Date.now() + 60*60*1000;
                let tokenObject = {
                    phone,
                    id : tokenId,
                    expires
                };

                //storing the data to db
                data.create('tokens', tokenId, tokenObject, (err) =>{
                    if(!err){
                        callback(200, tokenObject);
                    }else{
                        
                    }
                });
            }else{
                callback(400, {error : 'password is not correct'});
            }
        })
    }else{
        callback(400, {error : 'You have put invalid phone number'});
    }
};


handler._token.put = (requestProperties, callback) => {
    console.log(requestProperties.body.id, requestProperties.body.extend);
    const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 30 ? requestProperties.body.id : false;

    const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true : false;

    if(id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            let tokenObject = parseJSON(tokenData);
            if(tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                //updating the token id
                data.update('tokens', id, tokenObject, (err) => {
                    if(!err){
                        callback(200);
                    }else{
                        callback(500, {error : 'There was an error with server side'});
                    }
                })
            }else{
                callback(404, {error : 'Token hase expired'});
            }
        })
    }else{
        callback(404, {error: 'There is an error with your request'});
    }
};

handler._token.delete = (requestProperties, callback) => {
    //checking the token is valid or not
    const id = typeof(requestProperties.QueryStringObject.id) === 'string' && requestProperties.QueryStringObject.id.trim().length === 30 ? requestProperties.QueryStringObject.id : false;
    if(id){
        data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData){
                data.delete('tokens', id, (err) => {
                    if(!err){
                        callback(200, {message : 'Token deleted successfully'});
                    }else{
                        callback(400, {error : 'Token cannot be deleted'});
                    }
                });
            }else{
                callback(500, {error : 'error occured deleting user'});
            }
        });
    }else{
        callback(400, {
            error : 'You put the wrong id',
        })
    }
};

//authenticating function
handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if(!err && tokenData){
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()){
                callback(true);
            }else{
                callback(false)
            }
        }else{
            callback(false);
        }
    })
}
//export modules
module.exports = handler;