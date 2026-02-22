# MMM-SnowDay

*MMM-SnowDay* is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) that displays the percentage chance of getting a snow day tomorrow using the [Snow Day Predictor API](https://www.snowdaypredictor.com).

## Screenshot Loading

![Example of MMM-SnowDay Loading](./exampleloading.png)

## Screenshot Weekend/Error With Postal Code

![Example of MMM-SnowDay](./exampleweekend.png)

## Screenshot 0% Chance

![Example of MMM-SnowDay](./example0percentchance.png)

## Screenshot 99% Change

![Example of MMM-SnowDay](./example99percentchance.png)

## Installation

### Install

In your terminal, go to the modules directory and clone the repository:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/matthew-burley/MMM-SnowDay/
```

### Update

Go to the module directory and pull the latest changes:

```bash
cd ~/MagicMirror/modules/MMM-SnowDay
git pull
```

## Configuration

To use this module, you have to add a configuration object to the modules array in the `config/config.js` file.

### Finding your API URL

Search for your location on [snowdaypredictor.com](https://www.snowdaypredictor.com), then construct your API URL using the location slug from the results page URL. For example, if the site shows `/canoe-cove-pe`, your API URL is:

```
https://www.snowdaypredictor.com/api/query/canoe-cove-pe
```

### Example configuration

Minimal configuration to use the module:

```js
    {
        module: 'MMM-SnowDay',
        position: 'top_left',
        config: {
            apiUrl: "https://www.snowdaypredictor.com/api/query/canoe-cove-pe",
        }
    },
```

Configuration with all options:

```js
    {
        module: 'MMM-SnowDay',
        position: 'lower_third',
        config: {
            apiUrl: "https://www.snowdaypredictor.com/api/query/canoe-cove-pe",
            updateInterval: 60 * 60 * 1000,
            initialDelay: 15000
        }
    },
```

### Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`apiUrl`|Any Snow Day Predictor API URL|`"https://www.snowdaypredictor.com/api/query/canoe-cove-pe"`|The API URL for your location
`updateInterval`|`60 * 60 * 1000`|60 * 60 * 1000 [hourly]|The update interval
`initialDelay`|`15000`|15000 [15s]|The initial delay on startup to avoid RPi boot congestion

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgements

This project is based on the MMM-Template by [Dennis Rosenbaum](https://github.com/Dennis-Rosenbaum/MMM-Template).  
Honestly Dennis made it so easy to create a module; it's scary. Thanks a million.
The original project is licensed under the MIT License.
