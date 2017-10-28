// rf-log, a small logging lib for NodeJs
var fs = require('fs')

module.exports = {

   // default logging functions
   info: function () {
      log(arguments, '\x1b[34m', 'ℹ︎')
   },
   success: function () {
      log(arguments, '\x1b[32m', '✔')
   },
   warning: function () {
      log(arguments, '\x1b[33m', '⚠︎')
   },
   error: function () {
      log(arguments, '\x1b[31m', '✘')
   },
   critical: function () {
      throw new Error(log(arguments, '\x1b[31m', '✘'))
   },

   addLoggingFunction: function (name, color, prefix, toFilePath) {
      this[name] = function () {
         log(arguments, color, prefix, toFilePath)
      }
   },

   options: {
      mainPrefix: '',
      time: false,
      logFile: '',
      carriageReturn: true
   }
}

// main log function
function log (argumentsArray, color, prefix, toFilePath) {
   var opts = module.exports.options
   var filePath = opts.logFile
   if (toFilePath) filePath = toFilePath

   var args = [].slice.apply(argumentsArray) // convert arguments to an array

   if (opts.time) {
      args.unshift(new Date().toLocaleString().slice(3, 24))
   }

   args.unshift(opts.mainPrefix)
   if (prefix) args.unshift(prefix)

   // only for console, not files
   if (!filePath) {
      args.unshift(color) // turn on colored text at the beginning;
      if (opts.carriageReturn) args.unshift('\r') // start at the beginning of the line
      args.push('\x1b[0m') // reset message color to black at end;
   }

   if (filePath) {
      var string = ''
      args.forEach(function (arg) {
         string += arg
      })
      string += '\n' // linebreak
      fs.appendFile(filePath, string, function (err) {
         if (err) throw err
      })
   } else {
      console.log.apply(this, args)
   }
}
