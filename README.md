# Turb()

Function caching that turbo charges your application with safe and fast memory mangement.

## Installation

Install the SDK using NPM

### SDK

```text
npm i turb
```

### Server

#### Installing Bun

The turb server is built using Bun for its high speeds, if you do not have Bun already installed, go ahead and install it using the command below. Once the executable is built you can remove Bun and use the standalone binary.

```test
curl -fsSL https://bun.sh/install | bash
```

#### Building Executable

To build the server, clone the main repository from GitHub and run the build command. Once the application is built, you can we have a function that returns a promise and resolves it after a set amount of time. While is function is not practial, I feel it deminstraights the power of turb. Below we run the function three times, once as normal, and twice with turb move enabled. We run the turb one twice as the first time it is ran we need to cache the results, when the second one is called we are able to realize the time savings by getting the results from cache. the executable from the build folder to where ever you prefer and delete the git repository.

```text
git clone https://github.com/lakefox/turb.git
npm run build
```

#### Running the server

If you are running the turb server in production it is reccomended to use a service like pm2 to keep it online.

```text
./turb
```

##### Arguments

`--config="path/to/your/config.json"` (optional)

-   Specify the `config.json` file
-   If not provided a `config.json` file will be created in the current working directory

##### Config.json

The `config.json` file contains the setup for your cache server. Here you can define how many shards you want active and the maximum size of each shard is bytes. The default configuration is one shard named `main` with a maxiumum size of 10kb on port `6748`.

```json
{
    "shards": {
        "main": {
            "size": 10000
        }
    },
    "hostname": "0.0.0.0",
    "port": 6748
}
```

## Usage

### Importing

```javascript
import { Turb } from "turb";
```

### Connecting to the server

```javascript
let turb0 = new Turb({
    shard: "main",
});
```

If you have changed the hostname or port, you need to specify what you have changed them to during the connections phase like below.

```javascript
let turb0 = new Turb(
    {
        shard: "main",
    },
    8080,
    "turb.example.com"
);
```

### Registering a function

The `turb0.register` method takes both syncronous and asyncronous functions as a argument and returns an asyncronous function that. The returned result is a direct copy of the function passed in to it, so you can pass the same arguments and expect the same result. The difference between the two is when a turb function is called, if firsts checks if the cache server has stored the result, if it has then it will send the cached version instead of running the function. If the results are not cached, then the function will be ran, cached, then returned.

```javascript
function longFunction(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms, ms);
    });
}

let turb0LongFunction = turb0.register(longFunction);
```

In this example, we have a function that returns a promise and resolves it after a set amount of time. While is function is not practial, I feel it deminstraights the power of turb. Below we run the function three times, once as normal, and twice with turb enabled. We run the turb one twice as the first time it is ran we need to cache the results, when the second one is called we are able to realize the time savings by getting the results from cache.

### Executing

```javascript
console.time();
// Run the original function
await longFunction(2000);
console.timeEnd();

console.time();
// Run the turb() charged function and cache the results
await turb0LongFunction(2000);
console.timeEnd();

console.time();
// Fetch the cached results
await turb0LongFunction(2000);
console.timeEnd();
```

### Results

In the results below you can see that turb does add some overhead to the execution time however, this is made up for in the second and all subsecunt executions of the turb function.

```text
default: 2010 ms
default: 2030 ms
default: 360 ms
```

## Memory Mangement
