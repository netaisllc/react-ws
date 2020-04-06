// Instantiate mongo client and connect

const { MongoClient } = require('mongodb');
const secrets = require('./notes/secrets');
const uri = secrets.mongo;

const client = new MongoClient(uri, {
	useNewUrlParser    : true,
	useUnifiedTopology : true,
});

const makeConnection = async () => {
	try {
		const db = await client.connect();
		return db;
	} catch (e) {
		console.log(
			`[ERROR] Faied while making datstore connection object: ${JSON.stringify(
				e
			)}`
		);
	}
};

module.exports = makeConnection;
