var log = require('./index.js');
log.options.mainPrefix = "[TEST]";


log.info("add a custom logging function");
log.addLoggingFunction("customLogging", "\x1b[33m", "[CUSTOM]");
log.customLogging("test the custom Logging");


log.info("enabling time");
log.options.time = true;
log.info("onece with time; disabling again");
log.options.time = false;


log.info("now testing the standard functions");
log.info("info");
log.success("success");
log.warning("warning");
log.error("error");
log.critical("critical: this should throw an error and stop your app.");
