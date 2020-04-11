// MODELS operations
const _ = require("lodash");
const { ObjectID } = require("mongodb").ObjectID;
const secrets = require("./notes/secrets");

const developQuery = (ids) => {
    let oids = [];
    if (ids && ids.length > 0) {
        _.each(ids, (id) => {
            oids.push(ObjectID(id));
        });
    }
    return {
        _id: {
            $in: oids,
        },
    };
};

async function fetchModels(client, query) {
    let response;
    try {
        response = await client
            .collection(secrets.hive.collections.models)
            .find(query)
            .toArray();
        return response;
    } catch (err) {
        throw `DB/models: failed with request '${query}', ${err}`;
    }
}

const models = async (client, log, request) => {
    const query = developQuery(request);
    try {
        const results = await fetchModels(client, query);
        return results;
    } catch (e) {
        log.error(e);
        return false;
    }
};

module.exports = models;
