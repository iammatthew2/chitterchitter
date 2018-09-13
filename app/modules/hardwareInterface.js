const rpio = require('rpio');
const rpioHelpers = require('../util/rpioHelpers');
const eventBus = require('../util/eventBus');
const config = require('../util/config');

const { buttons, lights } = config.hardware;
const events = config.events;

function rotaryDialWatcher() {
  // try this: https://github.com/andrewn/raspi-rotary-encoder

/**
var raspi = require('raspi');
var RotaryEncoder = require('raspi-rotary-encoder').RotaryEncoder;

raspi.init(function() {
  var encoder = new RotaryEncoder({
    pins: { a: 5, b: 4 },
    pullResistors: { a: "up", b: "up" }
  });

  encoder.addListener('change', function (evt) {
    console.log('Count', evt.value);
  })
});
 */
  const dir = config.directions;
  let cache = 0;
  const encoder = {};
  encoder.on('change', (e) => {
    eventBus.emit(events.SCROLL_CONNECTION_SELECT, e.val > cache ? dir.forward : dir.back);
    cache = e.val;
  });
}

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
