function appStartUp(){
  console.log('Initializing ChitterChitter');
  require('dotenv').config();

  console.log('Loading iot hub');
  const iotHubInterface = require('./app/services/iotHubInterface');
  iotHubInterface.connect();
  iotHubInterface.sendFile();

  console.log('Loading hardware');
  const hardwareInterface = require('./app/modules/hardwareInterface');
  hardwareInterface.init();

  console.log('Loading event manager');
  const eventManager = require('./app/services/eventManager');
  eventManager.init();
  
  console.log('ChitterChitter is up and running')  
}

appStartUp();