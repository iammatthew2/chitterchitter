// start listening for hardware events
const initHardwareInterface = require('./modules/hardwareInterface');
initHardwareInterface();

// start checking for updates and listen for requestToSend events
const initSendReceive = require('./modules/sendReceive');
initSendReceive();

// start handling events
const initEventManager = require('./services/eventManager');
initEventManager();