# rf-log
Simple and Ready logging lib - no dependencys.

> npm install rf-log

## Example 1
![log-simple example](defaultFunctions.png)

```js
let log = require("rf-log").start("[SYSTEM-XY]");

log.success("Use the default functions here.");
log.info("The mainPrefix before is usefull - tells who loggs");
log.warning("Optionals use 'time' option");
log.error("short logs are nice - icons are shorter than words like 'error'");
log.critical("same as 'error', but also throws an Error and stops your app");

```

## Example 2
![log-simple example](logExample.png)

```js
var log = require("rf-log");

log.info('simple log');
log.withTime.success('log with time');
log.options.mainPrefix = '[SYSTEM-XY]';
log.success('log with prefix, several args', {'hello': 'world'});
```


## Second prefix for libs
This helps to find the origin of a message faster

![log-simple example](customPrefix.png)

```js
// NOTE: we assume this is a lib, and rf-log was already started in another file with the mainPrefix '[yourProcess]'


// start the logger and tell it the name of your lib
var log = require('rf-log').prefix('[DB-module]')


// no need mention `DB Module` again
log.success('connected')
log.info('receiving data')
log.error('connection refusing')

```


### Log to a file

```js
var log = require(rf-log);

log.options.logFilePath = __dirname +  "/log.txt";
log.success("this works", {"hello": "world"});

```


## Options

```js
var options = require(rf-log).options;
// the object is in every `require(rf-log)` present and looks like:
{
   mainPrefix: '',
   time: false,
   timeLocale: 'en-US',
   timeOptions: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
   logFilePath: '',
   carriageReturn: true
}

```
### Docs of time options
The lib uses Date.toLocaleString to create a time log.
https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date

### Docs of color options
http://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color


## How the lib works - creation of the strings
Each string is built in the following pattern:

prefix + mainPrefix + secondPrefix + time + argumentsToLog

## Development and Testing

> npm install

To be able to run grunt-eslint. Run a test script and `eslint` with:

> npm test


## Legal Issues
* Licenese: MIT
* Author: Felix Furtmayr
