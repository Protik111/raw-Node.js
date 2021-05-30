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

//random string generator
utilities.stringGenerator = (strLen) => {
    let length = strLen;
    length = typeof(strLen) === 'number' && strLen  > 0 ? strLen : false;
    if(length){
        const  possibleCharacter = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output;
        for(let i = 0; i<=length; i++){
            let randomCharacter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length)
            );
        output += randomCharacter;
        }
        return output;
    }else{
        return false;
    }
}
//export module
module.exports = utilities;