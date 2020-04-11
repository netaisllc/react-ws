// MAPs operations

// TODO this isn't good for a lot of maps b/c toArray()
// loads all docs into memory

async function fetchMaps(client, request) {
    let response;
    try {
        response = await client
            .collection(secrets.hive.collections.maps)
            .find({})
            .toArray();
        if (response) return response;
    } catch (err) {
        throw `DB/maps: failed with ${request}, ${err}`;
    }
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
