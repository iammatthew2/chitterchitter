console.log('Loading hardware');

const hardwareInterface = require('./app/modules/hardwareInterface');
hardwareInterface.init();

console.log('Hardware loaded');
console.log('Loading event manager');

const eventManager = require('./app/services/eventManager');
eventManager.init();

console.log('Event manger loaded');
console.log('App is running')