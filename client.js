process.stdin.resume();//so the program will not close instantly
var createSocket = require('dgram').createSocket;
var readline = require('readline');
const client = createSocket('udp4');

var SERVER_PORT = 3000;
var SERVER_HOST = '127.0.0.1';

var user = null;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.on('error', (err) => {
  console.log(`client error:\n${err.stack}`);
});

client.on('message', (msg, rinfo) => {
  let messageObject = JSON.parse(msg.toString());
  if(messageObject.header.type === 'close') {
    console.log(Buffer.from(messageObject.body.message).toString());
    process.exit();
  } else if(messageObject.header.type === 'Sending') {
    console.log(Buffer.from(messageObject.body.message).toString());
  } else {
    console.log('unknown message');
  }
});

client.on('listening', () => {
  var address = client.address();
});


rl.question('Please enter a username ', (answer) => {
  user = answer;
  let msg = {
        'header': {
          'type': 'connecting'
        },
        'body': {
          'user': `${user}`,
        }
      }
  let message = new Buffer(JSON.stringify(msg));
  client.send(message, 0, message.length, SERVER_PORT, SERVER_HOST);
});

rl.on('line', (input) => {
  let msg = {
        'header': {
          'type': 'Sending'
        },
        'body': {
          'sender': `${user}`,
          'message': `${input}`
        }
      }
  let message = JSON.stringify(msg);
  console.log(message);
  client.send(message, 0, message.length, SERVER_PORT, SERVER_HOST);
  console.log(`you: ${input}`);
});

