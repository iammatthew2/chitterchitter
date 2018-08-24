const rpio = require('rpio');
const rpioHelpers = require.main.require('./util/rpioHelpers');
const eventBus = require.main.require('./util/eventBus');


const { buttons, lights } = require.main.require('./constants/hardware');

module.exports = ()  => {  
  // open all the light pins
  const lightPins = Object.keys(lights).map(i => lights[i]);
  lightPins.forEach((pin) => rpio.open(pin, rpio.OUTPUT));

  // set all light pins as output and set to off
  lightPins.forEach((pin) => rpio.open(pin, rpio.OUTPUT));
  lightPins.forEach((pin) => rpio.write(pin, rpio.LOW));

  // open all the button pins
  const buttonPins = Object.keys(buttons).map(i => buttons[i]);
  buttonPins.forEach((pin) => rpio.open(pin, rpio.INPUT, rpio.PULL_UP));
  rpio.open(buttons.startStop, rpio.INPUT, rpio.PULL_UP);

  // start watching for button events
  rpioHelpers.safePoll(buttons.startStop, () => eventBus.emit('StartStopButtonPress'));
}
