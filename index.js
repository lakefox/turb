export function Turb(config, port = 6748, host = "0.0.0.0") {
    let shard = config.shard;
    this.register = (target, options = {}) => {
        let f = hashCode(target.toString());
        return function () {
            let params = [...arguments];
            let p = hashCode(params.toString());
            return new Promise((resolve, reject) => {
                fetch(`http://${host}:${port}/${shard}/${f}${p}`)
                    .then((e) => e.json())
                    .then(async (res) => {
                        if (res.found) {
                            resolve(res.data);
                        } else {
                            let start = new Date().getTime();
                            let data = target(...params);
                            if (typeof data?.then === "function") {
                                data = await data;
                            }
                            let end = new Date().getTime();
                            let execution = end - start;
                            fetch(`http://${host}:${port}/${shard}/${f}${p}`, {
                                method: "POST",
                                body: JSON.stringify({
                                    data,
                                    options,
                                    execution,
                                    shard,
                                }),
                            })
                                .then(() => {
                                    resolve(data);
                                })
                                .catch(reject);
                        }
                    })
                    .catch(reject);
            });
        };
    };
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
