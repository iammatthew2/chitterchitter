// start listening for hardware events
const hardwareInterface = require('./app/modules/hardwareInterface');
hardwareInterface.init();

// start checking for updates and listen for requestToSend events
const initSendReceive = require('./app/modules/sendReceive');
initSendReceive();

// start handling events
const initEventManager = require('./app/services/eventManager');
initEventManager();