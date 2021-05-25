//dependencies
const crypto = require('crypto');

//scafolding
const utilities = {};

//parse json string to object
utilities.parseJSON = (jsonString) => {
    let result;
    try{
        result = JSON.parse(jsonString);
    }catch{
        result = {};
    }
    return result;
}

//string
utilities.hash = (hashString) => {
    if(typeof hashString === 'string' && hashString.length > 0){
        const hash = crypto.createHmac('sha256', 'adbdcded').
        update(hashString)
        .digest('hex');
        return hash;
    }else{
        return false;
    }
}
//export module
module.exports = utilities;