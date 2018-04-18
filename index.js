// rf-log, a small logging lib for NodeJs
var fs = require('fs');

// console colors
// see http://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
var blue = '\x1b[34m',
   green = '\x1b[32m',
   yellow = '\x1b[33m',
   red = '\x1b[31m',
   black = '\x1b[0m';


module.exports = {

   // allow to start the logger with a prefix
   start: function (mainPrefix) {
      module.exports.options.mainPrefix = mainPrefix;
      return module.exports;
   },


   // default logging functions
   info: function () {
      _log(arguments, blue, 'ℹ︎');
   },

   success: function () {
      _log(arguments, green, '✔');
   },

   warning: function () {
      _log(arguments, yellow, '⚠︎');
   },

   error: function () {
      _log(arguments, red, '✘');
   },

   critical: function () {
      throw new Error(_log(arguments, red, '✘'));
   },

   // add custom logger instance
   customPrefixLogger: function (prefix) {
      return new _customPrefixLogger(prefix);
   },

   // add custom logging function
   addLoggingFunction: function (name, color, prefix, toFilePath, secondPrefix) {
      this[name] = function () {
         _log(arguments, color, prefix, toFilePath);
      };
   },

   options: {
      mainPrefix: '',
      time: false,
      logFile: '',
      carriageReturn: true
   }
};

// main log function
function _log (argumentsArray, color, prefix, toFilePath, secondPrefix) {
   var opts = module.exports.options;
   var filePath = opts.logFile;
   if (toFilePath) filePath = toFilePath;

   var args = [].slice.apply(argumentsArray); // convert arguments to an array

   if (opts.time) {
      args.unshift(new Date().toLocaleString().slice(3, 24));
   }

   if (secondPrefix) args.unshift(secondPrefix);
   if (opts.mainPrefix) args.unshift(opts.mainPrefix);
   if (prefix) args.unshift(prefix);

   // only for console, not files
   if (!filePath) {
      args.unshift(color); // turn on colored text at the beginning;
      if (opts.carriageReturn) args.unshift('\r'); // start at the beginning of the line
      args.push(black); // reset message color to black at end;
   }

   if (filePath) {
      var string = '';
      args.forEach(function (arg) {
         string += arg;
      });
      string += '\n'; // linebreak
      fs.appendFile(filePath, string, function (err) {
         if (err) throw err;
      });
   } else {
      console.log.apply(this, args);
   }
}


// customPrefixLogger: adds a second prefix. Output example:
//
// ✘ [ERP][rf-log] customLogger: no secondPrefix defined!
//
// idea: configure a custom logger once when starting a module of your code
// => find errors in the corresponding module faster
function _customPrefixLogger (secondPrefix) {
   if (!secondPrefix) logError('customLogger: no secondPrefix defined!');
   this.secondPrefix = secondPrefix;
   this.info = function () {
      _log(arguments, blue, 'ℹ︎', null, this.secondPrefix);
   };

   this.success = function () {
      _log(arguments, green, '✔', null, this.secondPrefix);
   };

   this.warning = function () {
      _log(arguments, yellow, '⚠︎', null, this.secondPrefix);
   };

   this.error = function () {
      _log(arguments, red, '✘', null, this.secondPrefix);
   };

   this.critical = function () {
      throw new Error(_log(arguments, red, '✘', null, this.secondPrefix));
   };
}

function logError () {
   throw new Error(_log(arguments, red, '✘', '[rf-log]'));
}
