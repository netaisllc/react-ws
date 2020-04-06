const { MongoClient } = require('mongodb');
const { secrets } = require('./notes/secrets');

const MONGO_URI = secrets.mongo;

async function fetchOneAccountById(client, id) {
	account = await client
		.db('dashboard')
		.collection('accounts')
		.findOne({ id: id });

	if (account) return account;
	throw `Dashboard.accounts: found no object with id '${id}'`;
}

const auth = async (accountId, log) => {
	const uri = MONGO_URI;
	const client = new MongoClient(uri, {
		useNewUrlParser    : true,
		useUnifiedTopology : true,
	});
	try {
		await client.connect();
		const result = await fetchOneAccountById(client, accountId);
		return result;
	} catch (e) {
		log.error(e);
		return false;
	} finally {
		await client.close();
	}
};

module.exports = auth;
