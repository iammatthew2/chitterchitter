/**
 * This is the event listener hub. We emit events at 
 * their logical spot and handle them here
 */

const throttle = require('throttleit');
const eventBus = require('../util/eventBus');
const recorder = require('../modules/record');
const iotHubInterface = require('./iotHubInterface');
const player = require('../modules/play');
const config = require('../util/config');
const { change, properties, stateStore } = require('../util/stateStore');

function toggleStartStopRecording() {
  if (stateStore.recorder === 'recording') {
    recorder.stopRecording();
  } else if (stateStore.player !== 'playing'){
    recorder.startRecording(config.recorderOptions);
  }
}

function toggleStartStopPlaying() {
  if (stateStore.player === 'playing') {
    player.stopPlaying();
  } else if (stateStore.recorder !== 'recording'){
    player.startPlaying(config.playerOptions);
  }
}

// dummy upload file
const filename = 'dummyUpload.wav';

function uploadFile(){
  iotHubInterface.iotHubActions.upload(filename);
}

function updateDeviceState() {
  iotHubInterface.iotHubActions.updateDeviceState({ narf: 'this is new' })
}

const downloadFile = () => {
  iotHubInterface.iotHubActions.download();
}

const events = config.events;

function init() {
  eventBus.on(events.START_STOP_RECORD_BUTTON_PRESS, toggleStartStopRecording);
  eventBus.on(events.START_STOP_PLAY_BUTTON_PRESS, toggleStartStopPlaying);
  eventBus.on(events.SCROLL_CONNECTION_SELECT, () => { console.log('scrolled') });
  eventBus.on(events.SEND_AUDIO_FILE_BUTTON_PRESS, uploadFile);
  eventBus.on(events.GET_FILE, downloadFile);
  eventBus.on(events.UPDATE_DEVICE_STATE, updateDeviceState);
  eventBus.on(events.PLAYER_STOPPED, () => change(properties.player, null, 'notPlaying'));
  eventBus.on(events.PLAYER_STARTED, () => change(properties.player, null, 'playing'));
  eventBus.on(events.RECORDER_STOPPED, () => change(properties.recorder, null, 'notRecording'));
  eventBus.on(events.RECORDER_STARTED, () => change(properties.recorder, null, 'recording'));
}

module.exports = { init };


// Some messy little helper code I will not keep


// record something, play something, upload a file, update state
const eventsToEmit = [
  // events.START_STOP_RECORD_BUTTON_PRESS,
  // events.START_STOP_RECORD_BUTTON_PRESS,
  // events.START_STOP_PLAY_BUTTON_PRESS,
  // events.START_STOP_PLAY_BUTTON_PRESS,
  // events.SEND_AUDIO_FILE_BUTTON_PRESS,
  events.GET_FILE,
  // events.UPDATE_DEVICE_STATE

];

function slowEach( array, interval, callback ) {
  if( ! array.length ) return;
  var i = 0;
  next();
  function next() {
      if( callback( array[i], i ) !== false ) {
          if( ++i < array.length ) {
              setTimeout( next, interval );
          }
      }
  }
}

eventBus.on(events.APPLICATION_STARTUP, () => {
  // slowEach(eventsToEmit, 3000, function(event) {
  //   eventBus.emit(event);
  // });

  const eventKeyboardPairs = {
    p: events.START_STOP_PLAY_BUTTON_PRESS,
    r: events.START_STOP_RECORD_BUTTON_PRESS,
    s: events.SEND_AUDIO_FILE_BUTTON_PRESS,
    g: events.GET_FILE,
    u: events.UPDATE_DEVICE_STATE
  }

  const validInputs = Object.keys(eventKeyboardPairs);
  const readline = require('readline');
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  
console.log('Here are the valid keyboard options:');
console.log(eventKeyboardPairs);

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      if (validInputs.includes(str)) {
        console.log(`Keyboard: ${eventKeyboardPairs[str]}`);
        eventBus.emit(eventKeyboardPairs[str]);
      }
    }
  });
});

