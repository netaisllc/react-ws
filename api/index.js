const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const log = require('simple-node-logger').createSimpleLogger();

const authWithDB = require('./authenticate');
const makeConnection = require('./datastore');
const maps = require('./maps');
let client;

// Use configured port or default
const port = process.env.PORT || 4001;

const connectionPool = async () => {
	client = await makeConnection();
};

// Main socket callback
const main = (socket) => {
	// Message/event handlers - - - - - - - - - - - - - - - -
	const authenticate = async (data) => {
		const accountId = data.accountId;
		const sessionId = data.sessionId;

		// Basic param check
		if (!accountId || !sessionId) {
			log.info(
				`[denied] Client ${socket.id}: Failed to send accountId or sessionId`
			);
			socket.emit('denied', {
				reason : 'Expected required properties are missing.',
			});
			return;
		}

		// Check account in datastore
		const allowed = await authWithDB(client, log, accountId);
		if (allowed) {
			log.info(`[allowed] Client ${socket.id}`);
			socket.emit('authenticated');
			return;
		}
		socket.emit('denied', {
			reason : 'Account id failed database authentication.',
		});

		return;
	};

	// Handle direct requets for maps; these occur when a client first connects
	const getMapsDirect = async (data) => {
		// Broadcast data to all other sockets EXCLUDING the socket which sent us the data
		// socket.broadcast.emit('data-out', { num: data });

		log.info('[maps request]', data);

		const results = await maps(client, log, data);
		if (results) {
			log.info(`[${results.length} maps returned] Client ${socket.id}`);
			socket.emit('maps', { data: results });
			return;
		}
	};

	// Maintenance callback
	const disconnection = () => {
		log.info(`[disconnected] Client ${socket.id}`);
	};
	// End message handlers - - - - - - - - - - - - - - - - -

	// New connection
	log.info(`[connection] Client ${socket.id}`);
	socket.emit('connected');

	// Listen for auth request
	socket.on('authentication', authenticate);

	// Disconnection clean-up
	socket.on('disconnect', disconnection);

	// Listen for direct requests for maps
	socket.on('maps', getMapsDirect);
};

// Setup datstore connection
connectionPool();

// Set up namespace "connection" for new socket connections
io.on('connection', main);

// Expose port & lister
server.listen(port, () =>
	log.info(`[api server.js] Listening on port ${port}`)
);
