// start listening for hardware events
const hardwareInterface = require('./modules/hardwareInterface');
hardwareInterface.init();

// start checking for updates and listen for requestToSend events
const initSendReceive = require('./modules/sendReceive');
initSendReceive();

// start handling events
const initEventManager = require('./services/eventManager');
initEventManager();