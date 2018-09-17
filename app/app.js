module.exports.appStartUp = () => {
  console.log('Initializing ChitterChitter');

  if (process.version.split('.')[0] !== 'v10') {
    console.log(`Problem - Node version: ${process.version}`);
    process.exit();
  }

  require('dotenv').config();

  console.log('Loading iot hub interface');
  const iotHubInterface = require('./services/iotHubInterface');
  iotHubInterface.connect();

  console.log('Loading hardware interface');
  const hardwareInterface = require('./modules/hardwareInterface');
  hardwareInterface.init();

  console.log('Loading event manager');
  const eventManager = require('./services/eventManager');
  eventManager.init();
  
  console.log('Loading file system interface');
  const fileProcesses = require('./services/fileProcesses');
  fileProcesses.init();

  console.log('Scheduling midnight cron job event emitter');
  const cronJobs = require('./services/cronJobs');
  cronJobs.scheduleMidnightEvent();

  console.log('Emitting application startup');
  const config = require('./util/config');
  const eventBus = require('./util/eventBus');
  eventBus.emit(config.events.APPLICATION_STARTUP);
}