// Authentication of browser client

async function fetchOneAccountById(client, id) {
	account = await client
		.db('dashboard')
		.collection('accounts')
		.findOne({ id: id });

	if (account) return account;
	throw `Dashboard.accounts: found no object with id '${id}'`;
}

const auth = async (client, log, accountId) => {
	try {
		const result = await fetchOneAccountById(client, accountId);
		return result;
	} catch (e) {
		log.error(e);
		return false;
	}
};

module.exports = auth;
