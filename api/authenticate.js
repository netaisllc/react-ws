// Authentication of browser client
const { ObjectID } = require("mongodb").ObjectID;
const secrets = require("./notes/secrets");

const verification = (account) => {
    if (!account || account.status !== "active") {
        return false;
    }
    return account;
};

const fetchOneAccountById = async (client, id) => {
    try {
        account = await client
            .collection(secrets.hive.collections.accounts)
            .findOne({ _id: ObjectID(id) });
        if (account) return account;
    } catch (err) {
        throw `DB/accounts: failed reading id ${id}, ${err}`;
    }
};

const auth = async (client, log, accountId) => {
    try {
        const result = await fetchOneAccountById(client, accountId);
        return verification(result);
    } catch (e) {
        log.error(e);
        return false;
    }
};

module.exports = auth;
