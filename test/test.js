var prefix = '[rf-log]';
var log = require('../index.js').start();

console.log('\n\nset mainPrefix: ' + prefix, 'and test the standard functions:');
log.info('info');
log.success('success');
log.warning('warning');
log.error('error');
// log.critical('critical: this should throw an error and stop your app.')


var secondPrefix = '[DB-module]';
console.log('\n\ntesting the prefix functions with secondPrefix ' + secondPrefix);
var customLog = log.prefix(secondPrefix);
customLog.success('connected');
customLog.info('receiving data');
customLog.info('receiving data again');


console.log('\n\nenabling time');
// direct call
log.withTime.info('log once with time');
log.info('log once without time');
// now put the logger in variable to reuse it
let logWithTime = log.withTime;
logWithTime.success('time is running');
logWithTime.prefix('[for a lib]').success('with second prefix');
var newCustomLogger = logWithTime.prefix('[for a new lib]');
newCustomLogger.info('it works');
newCustomLogger.options.time = false;
newCustomLogger.info('it works again without time');

logWithTime.warning('disabling again');


var log2 = require('../index.js');
log2.success('require the lib again');


console.log('\n\nSuccess!\n');
