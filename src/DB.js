export function DB(size) {
    let store = {};
    this.set = (key, value) => {
        let v = JSON.parse(value);
        v.freq = 0;
        let now = new Date().getTime();
        v.last = now;
        v.created = now;
        store[key] = v;
        // prune to save space
        store = prune(store, size);
    };
    this.get = (key) => {
        if (store[key]) {
            let now = new Date().getTime();
            if (store[key].options.expires) {
                if (now - store[key].created > store[key].options.expires) {
                    delete store[key];
                    return {
                        found: false,
                    };
                }
            }
            store[key].freq++;
            store[key].last = now;

            return {
                found: true,
                data: store[key].data,
            };
        } else {
            return {
                found: false,
            };
        }
    };
    this.size = () => size;
}

function prune(obj, size) {
    let objSize = obj.toString().length;
    if (objSize <= size) {
        return obj;
    } else {
        let keys = Object.keys(obj);
        let rank = [];
        for (let i = 0; i < keys.length; i++) {
            const value = obj[keys[i]];
            if (value.options.expires) {
                if (now - value.created > value.options.expires) {
                    delete obj[keys[i]];
                    break;
                }
            }
            rank.push({
                last: value.last,
                freq: value.freq,
                execution: value.execution,
                name: keys[i],
            });
        }
        // Sort by cost savings/ cheapest first
        rank.sort((a, b) => {
            return a.execution * a.freq - b.execution * b.freq;
        });
        while (obj.toString().length > size) {
            // get the oldest of the first two and delete it
            if (rank[0].last < rank[1].last) {
                delete obj[rank[0].name];
                rank.splice(0, 1);
            } else {
                delete obj[rank[1].name];
                rank.splice(1, 1);
            }
        }
        return obj;
    }
}
