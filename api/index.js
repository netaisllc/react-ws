const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const log = require("simple-node-logger").createSimpleLogger();

const authWithDB = require("./authenticate");
const makeConnection = require("./datastore");
const maps = require("./maps");
const videos = require("./videos");
let client;

// Use configured port or default
const port = process.env.PORT || 4001;

const connectionPool = async () => {
    try {
        client = await makeConnection();
    } catch (e) {
        log.error(`Failed to connect to database ${e}`);
        throw `DB / connectionPool failed`;
    }
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
            socket.emit("denied", {
                reason: "Expected required properties are missing.",
            });
            return;
        }

        // Check account in datastore
        const allowed = await authWithDB(client, log, accountId);
        if (allowed) {
            log.info(`[allowed] Client ${socket.id}`);
            socket.emit("authenticated");
            return;
        }
        socket.emit("denied", {
            reason: "Account id failed database authentication.",
        });

        return;
    };

    // Handle directed maps request
    const getDirectedMaps = async (data) => {
        // Broadcast data to all other sockets EXCLUDING the socket which sent us the data
        // socket.broadcast.emit('data-out', { num: data });

        log.info("[Directed request: maps]", data);

        const results = await maps(client, log, data);
        if (results) {
            log.info(`[${results.length} maps returned] Client ${socket.id}`);
            socket.emit("maps", { data: results });
            return;
        }
    };

    // Handle directed videos request
    const getDirectedVideos = async (data) => {
        // Broadcast data to all other sockets EXCLUDING the socket which sent us the data
        // socket.broadcast.emit('data-out', { num: data });

        log.info("[directed request: videos]", data);

        const results = await videos(client, log, data);
        if (results) {
            if (Array.isArray(results)) {
                log.info(
                    `[${results.length} videos returned] Client ${socket.id}`
                );
            } else {
                log.info(`[1 video returned] Client ${socket.id}`);
            }
            socket.emit("videos", { data: results });
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
    socket.emit("connected");

    // Listen for auth request
    socket.on("authentication", authenticate);

    // Disconnection clean-up
    socket.on("disconnect", disconnection);

    // Listen for directed request maps
    socket.on("maps", getDirectedMaps);

    // Listen for directed request videos
    socket.on("videos", getDirectedVideos);
};

// Setup datstore connection
connectionPool();

// Set up namespace "connection" for new socket connections
io.on("connection", main);

// Expose port & lister
server.listen(port, () =>
    log.info(`[api server.js] Listening on port ${port}`)
);
