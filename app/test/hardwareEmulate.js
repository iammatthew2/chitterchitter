
const readline = require('readline');
const config = require('../util/config');
const eventBus = require('../util/eventBus');

const events = config.events;

eventBus.on(events.APPLICATION_STARTUP, () => {
  const eventKeyboardPairs = {
    p: events.START_STOP_PLAY_BUTTON_PRESS,
    l: events.LISTEN_RECORDING_BUTTON_PRESS,
    r: events.START_STOP_RECORD_BUTTON_PRESS,
    s: events.SEND_AUDIO_FILE_BUTTON_PRESS,
    g: events.GET_FILE,
    u: events.UPDATE_DEVICE_STATE,
    c: events.SEND_DEVICE_MESSAGE,
    k: { event: events.SCROLL_CONNECTION_SELECT, arg: config.directions.forward },
    m: { event: events.SCROLL_CONNECTION_SELECT, arg: config.directions.back }
  }

  const validInputs = Object.keys(eventKeyboardPairs);
  
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  
  console.log('Here are the valid keyboard options:');
  console.log(eventKeyboardPairs);

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      if (validInputs.includes(str)) {
        if(typeof eventKeyboardPairs[str] === 'string') {
          console.log(`Keyboard: ${eventKeyboardPairs[str]}`);
          eventBus.emit(eventKeyboardPairs[str]);
        } else {
          console.log(`Keyboard: ${eventKeyboardPairs[str].event}`);
          eventBus.emit(eventKeyboardPairs[str].event, eventKeyboardPairs[str].arg);
        }
      }
    }
  });
});

require('../app').appStartUp();