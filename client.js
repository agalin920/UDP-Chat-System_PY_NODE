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
  let js = msg.toString('utf8');
  let json = JSON.parse(js);

  if(json.body.sender){
    if(json.body.sender != user){
      process.stdout.clearLine();  
      process.stdout.cursorTo(0); 
      console.log(json.body.sender+":"+json.body.message);
      process.stdout.write('you: ');
    }
  }
  
  
  
});

client.on('listening', () => {
  var address = client.address();
  process.stdout.write('you: ');
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
  //process.stdout.write('you: ');
});


rl.on('line', (input) => {
  process.stdout.write('you: ');
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
  client.send(message, 0, message.length, SERVER_PORT, SERVER_HOST);
});

