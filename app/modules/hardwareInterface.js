const Gpio = require('onoff').Gpio;
const rpioHelpers = require('../util/ioHelpers');
const eventBus = require('../util/eventBus');
const config = require('../util/config');

const pins = config.hardware;
const events = config.events;

const OUT = 'out';
const hardware = {
  init() {

    const toggleListenButton = new Gpio(pins.buttons.startStopListenRecording, 'in', 'both');
    const sendAudioFileButton = new Gpio(pins.buttons.sendAudioFile);
    const togglePlayButton = new Gpio(pins.buttons.startStopPlaying);
    const toggleRecordButton = new Gpio(pins.buttons.startStopRecording);
    // open all the light pins
    const lightPins = Object.keys(pins.lights).map(i => lights[i]);
    lightPins.forEach(pin => new Gpio(pin, OUT));

    // open all button pins
    const buttonPins = Object.keys(pins.buttons).map(i => buttons[i]);
    buttonPins.forEach(pin => new Gpio(pin, 'in', 'rising', {debounceTimeout: 10}));

    rpioHelpers.safePoll(pins.buttons.startStopRecording, () =>
      eventBus.emit(events.START_STOP_RECORD_BUTTON_PRESS));
    rpioHelpers.safePoll(pins.buttons.startStopPlaying, () =>
      eventBus.emit(events.START_STOP_PLAY_BUTTON_PRESS));
    rpioHelpers.safePoll(pins.buttons.sendAudioFile, () =>
      eventBus.emit(events.SEND_AUDIO_FILE_BUTTON_PRESS));
  },
};

module.exports = hardware;
