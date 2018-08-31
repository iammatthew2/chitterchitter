const rpio = require('rpio');
const rpioHelpers = require.main.require('./util/rpioHelpers');
const eventBus = require.main.require('./util/eventBus');


const { buttons, lights } = require.main.require('./constants/hardware');

hardware =  {
  init() {
    // open all the light pins
    const lightPins = Object.keys(lights).map(i => lights[i]);
    lightPins.forEach((pin) => rpio.open(pin, rpio.OUTPUT));

    // set all light pins as output and set to off
    lightPins.forEach((pin) => rpio.open(pin, rpio.OUTPUT));
    lightPins.forEach((pin) => rpio.write(pin, rpio.LOW));

    // open all button pins
    const buttonPins = Object.keys(buttons).map(i => buttons[i]);
    buttonPins.forEach((pin) => rpio.open(pin, rpio.INPUT, rpio.PULL_UP));

    rpioHelpers.safePoll(buttons.startStopRecording, () => eventBus.emit('StartStopRecordButtonPress'));
    rpioHelpers.safePoll(buttons.startStopPlaying, () => eventBus.emit('StartStopPlayButtonPress'));
    console.log('Hardware Interface successfully loaded');
  },

  toggleLightArray(lightArray = [], turnOn = true) {
    lightArray.forEach(light => rpio.write(light, turnOn ? rpio.HIGH : rpio.LOW));
  },

  toggleSingleLight(light, turnOn) {
    toggleLightArray([light], turnOn);
  },

  iterateThroughLightArray(lightArray, startAllOn = false) {
    toggleLightArray(lightArray, startAllOn);
  }
}

module.exports = hardware;
