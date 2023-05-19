import { DB } from "./DB";

let db = {};

const defaultConfig = {
    shards: {
        main: {
            size: 10000,
        },
    },
    hostname: "0.0.0.0",
    port: 6748,
};

let configFile = (
    process.argv.filter((e) => e.indexOf("--config=") != -1)[0] ||
    `--config=config.json`
).slice(9);

let config;
try {
    config = await Bun.file(configFile, {
        type: "application/json",
    }).json();
} catch (error) {
    await Bun.write("config.json", JSON.stringify(defaultConfig));
    config = defaultConfig;
}

let configKeys = Object.keys(config.shards);

// Init DB shards
for (let i = 0; i < configKeys.length; i++) {
    const shard = configKeys[i];
    db[shard] = new DB(config.shards[shard].size || 10000);
}

Bun.serve({
    port: config.port || 6748,
    hostname: config.hostname || "0.0.0.0",
    async fetch(request) {
        try {
            const url = new URL(request.url);
            if (request.method == "POST") {
                let u = url.pathname.slice(1).split("/");
                let out = await Bun.readableStreamToText(request.body);
                if (db[u[0]]) {
                    db[u[0]].set(u[1], out);
                } else {
                    throw "Shard not Found";
                }
                return new Response("{}");
            } else if (request.method == "GET") {
                let u = url.pathname.slice(1).split("/");
                if (db[u[0]]) {
                    let r = db[u[0]].get(u[1]);
                    return new Response(JSON.stringify(r));
                } else {
                    throw "Shard not Found";
                }
            }
        } catch (error) {
            return new Response(
                JSON.stringify({
                    error,
                })
            );
        }
    },
});
