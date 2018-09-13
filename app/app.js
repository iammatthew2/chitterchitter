module.exports.appStartUp = () => {
  console.log('Initializing ChitterChitter');
  console.log(`Node version: ${process.version}`);
  require('dotenv').config();

  console.log('Loading iot hub and connecting');
  const iotHubInterface = require('./services/iotHubInterface');
  iotHubInterface.connect();

  console.log('Loading hardware');
  const hardwareInterface = require('./modules/hardwareInterface');
  hardwareInterface.init();

  console.log('Loading event manager');
  const eventManager = require('./services/eventManager');
  eventManager.init();
  
  console.log('ChitterChitter is up and running');

  const config = require('./util/config');
  const eventBus = require('./util/eventBus');
  eventBus.emit(config.events.APPLICATION_STARTUP);
}

