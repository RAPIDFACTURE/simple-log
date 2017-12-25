var log = require('../index.js')


var prefix = '[rf-log]'
log.options.mainPrefix = prefix
console.log('set mainPrefix: ' + prefix, 'and test the standard functions:')
log.info('info')
log.success('success')
log.warning('warning')
log.error('error')
// log.critical('critical: this should throw an error and stop your app.')


var secondPrefix = '[DB-module]'
console.log('testing the customPrefixLogger functions with secondPrefix ' + secondPrefix)
var customLog = log.customPrefixLogger(secondPrefix)
customLog.success('connected')
customLog.info('receiving data')


console.log('removing main prefix again, testing addLoggingFunction')
log.options.mainPrefix = null
log.addLoggingFunction('customLogging', '\x1b[35m', 'x')
log.customLogging('test the custom Logging')


console.log('enabling time')
log.options.time = true
log.info('once with time')
log.options.time = false
log.warning('disabling again')


console.log('Success!')
