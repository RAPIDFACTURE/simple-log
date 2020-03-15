// rf-log, a small logging lib for NodeJs
let fs = require('fs');

// console colors
// see http://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
let blue = '\x1b[34m',
   green = '\x1b[32m',
   yellow = '\x1b[33m',
   red = '\x1b[31m',
   black = '\x1b[0m';

let consoleOptions = {
   info: {color: blue, prefix: 'ℹ︎'},
   success: {color: green, prefix: '✔'},
   warning: {color: yellow, prefix: '⚠︎'},
   error: {color: red, prefix: '✘', error: true},
   critical: {color: red, prefix: '✘', error: 'critical'}
};

let defaultOptions = {
   // mainPrefix: '',
   time: false,
   timeLocale: 'en-US',
   // date options on: https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
   timeOptions: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
   logFilePath: '',
   carriageReturn: true
};


module.exports = newLogFunctions();



function newLogFunctions (opts, newOpts) {
   let obj = {};
   opts = opts || {};
   newOpts = newOpts || {};
   opts = JSON.parse(JSON.stringify(opts));
   newOpts = JSON.parse(JSON.stringify(newOpts));
   for (let key in newOpts) {
      opts[key] = newOpts[key];
   }

   // console.log(opts, newOpts);

   obj.options = opts;

   obj.start = function (mainPrefix, options) {
      obj.options.mainPrefix = mainPrefix;

      if (!obj.options.time && !obj.withTime) {
         obj.withTime = (function () {
            console.log('mainPrefix', obj.options.mainPrefix);
            return newLogFunctions(obj.options, {time: true});
         }());
      }


      return obj;
   };

   // default logging functions
   for (let key of ['info', 'success', 'warning', 'error', 'critical']) {
      obj[key] = function () {
         let consoleOpts = JSON.parse(JSON.stringify(consoleOptions[key]));
         consoleOpts = Object.assign(consoleOpts, obj.options);
         _log(arguments, consoleOpts, obj.options);
      };
   }

   // add logger instance; example output:
   // ✘ [ERP][rf-log] test 123!
   obj.prefix = function (secondPrefix) {
      if (!secondPrefix) throw new Error('customLogger: no secondPrefix defined!');
      return newLogFunctions(obj.options, {secondPrefix: secondPrefix});
   };

   obj.customPrefixLogger = obj.prefix; // for compatibility with older versions


   return obj; // clone obj
}

// main log function
function _log (argumentsArray, options) {

   // merge options
   var opts = options || {};
   for (var key in defaultOptions) {
      if (!options[key] && options[key] !== false) options[key] = defaultOptions[key];
   }

   var args = [].slice.apply(argumentsArray); // convert arguments to an array

   // show time: always or on errors
   if (opts.time || opts.error) {
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

      if (options.error === 'critical') {
         throw new Error(console.log.apply(this, args));
      }

   // log to console
   } else {
      args.unshift(opts.color); // turn on colored text at the beginning;
      if (opts.carriageReturn) args.unshift('\r'); // start at the beginning of the line
      args.push(black); // reset message color to black at end;

      if (options.error === 'critical') {
         throw new Error(console.log.apply(this, args));
      } else {
         console.log.apply(this, args);
      }
   }
}
