process.stdin.resume(); //so the program will not close instantly
let createSocket = require('dgram').createSocket;
let readline = require('readline');
let util = require('util')
const client = createSocket('udp4');

let SERVER_PORT = 3000;
let SERVER_HOST = '127.0.0.1';

let user = null;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.on('error', (err) => {
  console.log(`Client error:\n${err.stack}`);
});

client.on('message', (msg, rinfo) => {
  let js = msg.toString('utf8');
  let json = JSON.parse(js);

  if(json.body.sender && json.body.sender != user){
    process.stdout.clearLine();  
    process.stdout.cursorTo(0); 
    console.log(`${json.body.sender}: ${json.body.message}`);
    process.stdout.write(`${user}: `);
  }
});

client.on('listening', () => {
  let address = client.address();
  process.stdout.write(`${user}: `);
});

rl.question('Welcome to the coolest chat\nPlease enter a username: ', (answer) => {
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
  process.stdout.write(`${user}: `);
  let msg = {
    'header': {
      'type': 'Sending'
    },
    'body': {
      'sender': `${user}`,
      'message': `${input}`
    }
  }
  execCommand(input.trim());
  let message = JSON.stringify(msg);
  client.send(message, 0, message.length, SERVER_PORT, SERVER_HOST);
}).on('close', () => {
  //it gets triggered by ^C or ^D
  util.puts('\nGoodbye!');
  process.exit(0);
});

function execCommand(command) {
  switch (command) {
    case '4':
    case 'exit':
    case 'quit':
    case 'salir':
    case 'q':
      process.exit(0);
      break;
  }
}