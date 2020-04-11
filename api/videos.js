// VIDEOS operations
const _ = require("lodash");
const secrets = require("./notes/secrets");
const models = require("./models");

const assemble = async (client, video, log) => {
    let children;
    if (_.has(video, "childModelIds")) {
        // get models
        children = await models(client, log, video.childModelIds);
    } else {
        children = [];
    }
    // inject models to video
    video.models = children;
    // add to return set
    return video;
};

const fetchVideos = async (client, log, request) => {
    let response = [];
    try {
        const cursor = await client
            .collection(secrets.hive.collections.videos)
            .find({});

        while (await cursor.hasNext()) {
            const video = await cursor.next();
            if (video) {
                response.push(assemble(client, video, log));
            }
        }

        return response;
    } catch (err) {
        throw `DB/videos: failed with request '${request}', ${err}`;
    }
};

const videos = async (client, log, request) => {
    try {
        const results = await fetchVideos(client, log, request);
        return results;
    } catch (e) {
        log.error(e);
        return false;
    }
};

module.exports = videos;
