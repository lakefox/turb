# Turb()

Function caching that turbo charges your application

## Installation

### SDK

```text
npm i turb
```

### Server

### Building Executable

```text
npm run build
```

### Running the server

```text
./build/turb
```

#### Arguments

-   `--config` (optional)
-   Specify the `config.json` file
-   If not provided a `config.json` file will be created in the current working directory

#### Config.json

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

## API

### Importing

```javascript
import { Turb } from "turb";
```
