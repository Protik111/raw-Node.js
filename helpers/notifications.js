//dependencies
const https = require('https');
const { twilio } = require('./environments');
const querystring = require('querystring');

//module scafolding
const notifications = {};

//send sms to user using Twilio api
notifications.sendMessage = (phone, msg, callback) => {
    const userPhone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false;
    const userMsg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg : false;
    if(userPhone && userMsg) {
        //configure the request payload
        const payload = {
            From : twilio.fromPhone,
            To : `+88${userPhone}`,
            Body: userMsg,
        };
        //payload object to stringify
        const payloadString = querystring.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(payloadString);
        req.end();
    }else{
        callback('Given parameters are missing');
    }
}