//dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');
const {sendTwilioSms} = require('./helpers/notifications');

//creating file
// data.create('test', 'myFile', {name: 'bangladesh', continent:'asia'}, (err) =>{
//     console.log('error is', err);
// })

// //reading file
// data.read('test', 'myFile', (err, data) =>{
//     console.log(err, data);
// })

//updating existing file
// data.update('test', 'myFile', {name: 'Norway', continent:'Europe'}, (err) =>{
//     console.log(err);
// })

//deleting the myFile
// data.delete('test', 'myFile', (err) =>{
//     console.log(err);
// })

//creating scafoldings
const app = {};

// @TODO remove later
sendTwilioSms('01771904605', 'Hello world', (err) => {
    console.log(`this is the error`, err);
});

//configuration
// app.config = {
//     port : 3000
// };

//create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        // console.log(`Environment variable is ${process.env.NODE_ENV}`);
        console.log(`Listening to port ${environment.port}`);
    });
}

//handle request
app.handleReqRes = handleReqRes;

//starting the server
app.createServer();