// Instantiate mongo client and connect
const { MongoClient } = require("mongodb");
const secrets = require("./notes/secrets");

const uri = secrets.hive.target;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const makeConnection = async () => {
    try {
        const conn = await client.connect();
        return conn.db(secrets.hive.base);
    } catch (e) {
        console.log(
            `[ERROR] Failed while making datstore connection object: ${JSON.stringify(
                e
            )}`
        );
    }
};

module.exports = makeConnection;
