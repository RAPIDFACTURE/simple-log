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
      _log(arguments, {color: blue, prefix: 'ℹ︎'});
   },

   success: function () {
      _log(arguments, {color: green, prefix: '✔'});
   },

   warning: function () {
      _log(arguments, {color: yellow, prefix: '⚠︎'});
   },

   error: function () {
      _log(arguments, {color: red, prefix: '✘', error: true});
   },

   critical: function () {
      throw new Error(_log(arguments, {color: red, prefix: '✘', error: true}));
   },

   // add custom logger instance
   customPrefixLogger: function (prefix) {
      return new _customPrefixLogger(prefix);
   },

   // add custom logging function
   addLoggingFunction: function (name, options) {
      this[name] = function () {
         _log(arguments, options);
         // _log(arguments, color, prefix, toFilePath, secondPrefix);
      };
   },

   // date options on: https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date

   options: {
      mainPrefix: '',
      time: false,
      timeLocale: 'en-US',
      timeOptions: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
      logFilePath: '',
      carriageReturn: true,
      showTimeOnError: true
   }
};

// main log function
function _log (argumentsArray, options) {

   // merge options
   var opts = options || {};
   for (var key in module.exports.options) {
      if (!options[key]) options[key] = module.exports.options[key];
   }

   var args = [].slice.apply(argumentsArray); // convert arguments to an array

   // show time: always or on errors
   if (opts.time || (opts.error && opts.showTimeOnError)) {
      args.unshift(new Date().toLocaleString(opts.timeLocale, opts.timeOptions));
   }

   if (opts.secondPrefix) args.unshift(opts.secondPrefix);
   if (opts.mainPrefix) args.unshift(opts.mainPrefix);
   if (opts.prefix) args.unshift(opts.prefix);


   // log to file
   if (opts.logFilePath) {
      var string = '';
      args.forEach(function (arg) {
         string += arg;
      });
      string += '\n'; // linebreak
      fs.appendFile(opts.logFilePath, string, function (err) {
         if (err) throw err;
      });

   // log to console
   } else {
      args.unshift(opts.color); // turn on colored text at the beginning;
      if (opts.carriageReturn) args.unshift('\r'); // start at the beginning of the line
      args.push(black); // reset message color to black at end;

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
   this.info = function () {
      _log(arguments, {color: blue, prefix: 'ℹ︎', secondPrefix: secondPrefix});
   };

   this.success = function () {
      _log(arguments, {color: green, prefix: '✔', secondPrefix: secondPrefix});
   };

   this.warning = function () {
      _log(arguments, {color: yellow, prefix: '⚠︎', secondPrefix: secondPrefix });
   };

   this.error = function () {
      _log(arguments, {color: red, prefix: '✘', secondPrefix: secondPrefix, error: true});
   };

   this.critical = function () {
      throw new Error(_log(arguments, {color: red, prefix: '✘', secondPrefix: secondPrefix, error: true }));
   };
}

function logError () {
   throw new Error(_log(arguments, {color: red, prefix: '✘', secondPrefix: '[rf-log]', error: true}));
}
