const throttle = require('throttleit');
const eventBus = require('../util/eventBus');
const recorder = require('../modules/record');
const iotHubInterface = require('./iotHubInterface');
const player = require('../modules/play');
const config = require('../util/config');
const { change, states, stateStatusStore } = require('../util/stateStore');

function toggleStartStopRecording() {
  console.log('toggle Recorder');
  if (stateStatusStore.currentlyRecording) {
    recorder.stopRecording();
    change(states.currentlyRecording);
  } else if (!stateStatusStore.currentlyPlaying){
    recorder.startRecording(config.recorderOptions);
    change(states.currentlyRecording);
  }
}

function toggleStartStopPlaying() {
  console.log('toiglgle playerr')
  if (stateStatusStore.currentlyPlaying) {
    player.stopPlaying();
    change(states.currentlyPlaying);
  } else if (!stateStatusStore.currentlyRecording){
    player.startPlaying(config.playerOptions);
    change(states.currentlyPlaying);
  }
}

const filename = 'out22.wav';

function sendFile(){
  iotHubInterface.iotHubActions.sendFile(filename);
}

function updateDeviceState() {
  iotHubInterface.iotHubActions.updateDeviceState({narf: 'this is new'})
}

function getFile() {
  console.log('getting file');
}

const events = config.events;

function init() {
  // TODO: start use debounce in a few places - such as UPDATE_DEVICE_STATE
  eventBus.on(events.START_STOP_RECORD_BUTTON_PRESS, toggleStartStopRecording);
  eventBus.on(events.START_STOP_PLAY_BUTTON_PRESS, toggleStartStopPlaying);
  eventBus.on(events.SCROLL_CONNECTION_SELECT, () => { console.log('scrolled') });
  eventBus.on(events.SEND_AUDIO_FILE_BUTTON_PRESS, sendFile);
  eventBus.on(events.GET_FILE, getFile);
  eventBus.on(events.UPDATE_DEVICE_STATE, updateDeviceState);

}

module.exports = { init };


// Some messy little helper code I will not keep


// record something, play something, upload a file, update state
const eventsToEmit = [
  events.START_STOP_RECORD_BUTTON_PRESS,
  events.START_STOP_RECORD_BUTTON_PRESS,
  events.START_STOP_PLAY_BUTTON_PRESS,
  events.START_STOP_PLAY_BUTTON_PRESS,
  events.SEND_AUDIO_FILE_BUTTON_PRESS,
  events.GET_FILE,
  events.UPDATE_DEVICE_STATE

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
  slowEach(eventsToEmit, 3000, function(event) {
    eventBus.emit(event);
  });
});
