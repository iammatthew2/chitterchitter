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
  console.log('toggle player')
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
  console.log('send file');
  iotHubInterface.iotHubActions.sendFile(filename);
}

function updateDeviceState() {
  console.log('update device');
  iotHubInterface.iotHubActions.updateDeviceState({narf: 'this is new'})
}

const getFile2 = () => {
  iotHubInterface.iotHubActions.download2();
}

const getFile = async() => {
  console.log('getting file');
  try {
    const response = await iotHubInterface.iotHubActions.download();
    console.log(response.message);

    if (response.data) {
        response.data.entries.forEach(entry => {
            console.log('Name:', entry.name, ' Type:', entry.blobType)
        });
    }
  } catch(e){
debugger;
  }
}

const events = config.events;

function init() {
  // TODO: start use debounce in a few places - such as UPDATE_DEVICE_STATE
  eventBus.on(events.START_STOP_RECORD_BUTTON_PRESS, toggleStartStopRecording);
  eventBus.on(events.START_STOP_PLAY_BUTTON_PRESS, toggleStartStopPlaying);
  eventBus.on(events.SCROLL_CONNECTION_SELECT, () => { console.log('scrolled') });
  eventBus.on(events.SEND_AUDIO_FILE_BUTTON_PRESS, sendFile);
  eventBus.on(events.GET_FILE, getFile2);
  eventBus.on(events.UPDATE_DEVICE_STATE, updateDeviceState);

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
  slowEach(eventsToEmit, 3000, function(event) {
    eventBus.emit(event);
  });
});
