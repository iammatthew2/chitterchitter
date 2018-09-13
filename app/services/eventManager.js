/**
 * This is the event listener hub. We emit events at 
 * their logical spot and handle them here
 */
const eventBus = require('../util/eventBus');
const iotHubInterface = require('./iotHubInterface');
const config = require('../util/config');
const { toggleStartStopRecording, toggleStartStopPlaying } = require('../util/audioHelpers');
const { change, entities, stateStore, directions } = require('../util/stateStore');

// dummy upload file
const filename = 'dummyUpload.wav';

function uploadFile(){
  iotHubInterface.iotHubActions.upload(filename);
}

function updateDeviceState() {
  iotHubInterface.iotHubActions.updateDeviceState({ narf: 'this is new' })
}

/*


abcTwin = {
  slot1: 'qrx',
  slot2: 'efg',
  slot3: 'tuv',
  slot4: 'lmn',
  slot5: 'hij',
  slot1Send: 'qrxRandomlyGeneratedName',
  slot2Send: 'efgRandomlyGeneratedName',
  slot3Send: 'tuvRandomlyGeneratedName',
  slot4Send: 'lmnRandomlyGeneratedName',
  slot5Send: 'hijRandomlyGeneratedName',
  slot1Receive: 'qrxOtherGeneratedName',
  slot2Receive: 'efgOtherGeneratedName',
  slot3Receive: 'tuvOtherGeneratedName',
  slot4Receive: 'lmnOtherGeneratedName',
  slot5Receive: 'hijOtherGeneratedName'
};

qrxTwin = {
  slot1: 'wrt',
  slot2: 'efg',
  slot3: 'tuv',
  slot4: 'lmn',
  slot5: 'abc',
  slot1Send: 'wrtRandomlyGeneratedName',
  slot2Send: 'efgRandomlyGeneratedName',
  slot3Send: 'tuvRandomlyGeneratedName',
  slot4Send: 'lmnRandomlyGeneratedName',
  slot5Send: 'abcRandomlyGeneratedName',
  slot1Receive: 'wrtOtherRandomlyGeneratedName',
  slot2Receive: 'efgOtherRandomlyGeneratedName',
  slot3Receive: 'tuvOtherRandomlyGeneratedName',
  slot4Receive: 'lmnOtherRandomlyGeneratedName',
  slot5Receive: 'abcOtherRandomlyGeneratedName',
};
*/

const sendDeviceMessageContent = {
  messageText: 'this is the new msg Obj',
  sendToDeviceId: 'abc123', // twin slot1
  sendFromDeviceId: 'abc123',
  audioFile: 'someFile' //twin slot1Send
}
const myTempDeviceID = 'abc123';
sendDeviceMessageContent[`audioFromDevice${myTempDeviceID}`] = 'hashedFileName';

function sendDeviceMessage() {
  iotHubInterface.iotHubActions.sendMesssage(sendDeviceMessageContent);
}

/**
   messageText,
      sendToDeviceId,
      sendFromDeviceId,
      audioFile 
 
 */

const downloadFile = () => iotHubInterface.iotHubActions.download();

const events = config.events;

function init() {
  eventBus.on(events.START_STOP_RECORD_BUTTON_PRESS, toggleStartStopRecording);
  eventBus.on(events.START_STOP_PLAY_BUTTON_PRESS, toggleStartStopPlaying);
  eventBus.on(events.SCROLL_CONNECTION_SELECT, e => { 
    if (e && config.directions[e]) {
      change(entities.currentConnection, config.directions[e]);
    }
  });
  eventBus.on(events.SEND_AUDIO_FILE_BUTTON_PRESS, uploadFile);
  eventBus.on(events.GET_FILE, downloadFile);
  eventBus.on(events.UPDATE_DEVICE_STATE, updateDeviceState);
  eventBus.on(events.SEND_DEVICE_MESSAGE, sendDeviceMessage);
  eventBus.on(events.PLAYER_STOPPED, () => change(entities.player, null, 'notPlaying'));
  eventBus.on(events.PLAYER_STARTED, () => change(entities.player, null, 'playing'));
  eventBus.on(events.RECORDER_STOPPED, () => change(entities.recorder, null, 'notRecording'));
  eventBus.on(events.RECORDER_STARTED, () => change(entities.recorder, null, 'recording'));




}

module.exports = { init };

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
  // slowEach(eventsToEmit, 3000, function(event) {
  //   eventBus.emit(event);
  // });

  const eventKeyboardPairs = {
    p: events.START_STOP_PLAY_BUTTON_PRESS,
    r: events.START_STOP_RECORD_BUTTON_PRESS,
    s: events.SEND_AUDIO_FILE_BUTTON_PRESS,
    g: events.GET_FILE,
    u: events.UPDATE_DEVICE_STATE,
    c: events.SEND_DEVICE_MESSAGE,
    k: { event: events.SCROLL_CONNECTION_SELECT, arg: config.directions.forward },
    m: { event: events.SCROLL_CONNECTION_SELECT, arg: config.directions.back }
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