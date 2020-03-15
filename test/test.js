var prefix = '[rf-log]';
var log = require('../index.js').start(prefix);

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
log.withTime.info('log once with time');
log.info('log once without time');


let logWithTime = log.withTime;
logWithTime.success('time is running');
logWithTime.prefix('[helper]').success('with prefix');

var newCustomLogger = logWithTime.prefix('[password]');
newCustomLogger.info('with another prefix');
newCustomLogger.options.time = false;
newCustomLogger.info('it works again without time');


console.log('\n\nrequire a second time - for use in a separate lib');
var log2 = require('../index.js');
log2.success('the main prefix should be here again');


console.log('\n\nSuccess!\n');
