const rpio = require('rpio');
const rpioHelpers = require.main.require('./app/util/rpioHelpers');
const eventBus = require.main.require('./app/util/eventBus');
const config = require.main.require('./app/util/config');

const { buttons, lights } = config.hardware;
const events = config.events;

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
    
    rpioHelpers.safePoll(buttons.startStopRecording, () => eventBus.emit(events.START_STOP_RECORD_BUTTON_PRESS));
    rpioHelpers.safePoll(buttons.startStopPlaying, () => eventBus.emit(events.START_STOP_PLAY_BUTTON_PRESS));
    rpioHelpers.safePoll(buttons.sendAudioFile, () => eventBus.emit(events.SEND_AUDIO_FILE_BUTTON_PRESS));
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
