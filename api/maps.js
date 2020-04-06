// MAPs operations

async function fetchMaps(client, request) {
	data = await client.db('dashboard').collection('maps').find({}).toArray();

	if (data) return data;
	throw `Dashboard.maps: failed with request '${request}'`;
}

const maps = async (client, log, request) => {
	try {
		const results = await fetchMaps(client, request);
		return results;
	} catch (e) {
		log.error(e);
		return false;
	}
};

module.exports = maps;
