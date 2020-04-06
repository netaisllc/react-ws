let socket = require('socket.io-client')('http://127.0.0.1:4001');

//starting speed at 0
let speed = 0;

//Simulating reading data every 100 milliseconds
setInterval(function() {
	//some sudo-randomness to change the values but not to drastically
	let nextMin = speed - 2 > 0 ? speed - 2 : 2;
	let nextMax =
		speed + 5 < 140 ? speed + 5 : Math.random() * (130 - 5 + 1) + 5;
	speed = Math.floor(Math.random() * (nextMax - nextMin + 1) + nextMin);

	//we emit the data. No need to JSON serialization!
	socket.emit('data-in', speed);
}, 5000);
