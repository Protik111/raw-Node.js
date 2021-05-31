//dependencies

//module scafolding
const environments = {};

environments.staging = {
    port : 3000,
    envName : 'staging',
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
}

environments.production = {
    port : 5000,
    envName : 'production',
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
}

//determine which environment is passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

//export corresponding environment object
const environmentsToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

//export module
module.exports = environmentsToExport;