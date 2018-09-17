const path = require('path');
let topLevelDirectory = path.dirname(require.main.filename);
topLevelDirectory = topLevelDirectory.replace('/app/test', '');

const IS_DEBUG = true;

module.exports = {
  dev: {
    isMock: true,
    isDebug: IS_DEBUG,
    mockDelay: 1000,
    executeQue: false
  },
  deviceStates: {
    newDevice: 'newDevice',
    ready: 'ready',
  },
  defaultThrottleRate: 500,
  playerOptions: {
    gain: 10,
    debug: IS_DEBUG
  },
  preRecordPlayerOptions: {
    filename: path.join(topLevelDirectory,'startRecordingPlease.wav'),
    gain: 8,
    debug: IS_DEBUG
  },
  recorderOptions: {
    rate: '16000',
    channels: '1',
    debug: IS_DEBUG,
    exitOnSilence: 6,
    fileType: 'wav'
  },
  audioOutFileNames: {
    slot1Send: '',
    slot2Send: '',
    slot3Send: '',
    slot4Send: '',
    slot5Send: ''
  },
  filesReadyToSendUp: [],
  hardware: {
    buttons: {
      startStopRecording: 31,
      startStopListenRecording: 29,
      startStopPlaying: 40,
      sendAudioFile: 36
    },
    rotaryDial: {
      pwr: 'not sure how this works',
      clk: 'whatever'
    },
    lights: {
      green: 15,
      red: 16
    }
  },
  directions: {
    forward: 'forward',
    back: 'back'
  },
  events: {
    START_STOP_RECORD_BUTTON_PRESS: 'startStopRecordButtonPress',
    LISTEN_RECORDING_BUTTON_PRESS: 'startStopListenRecordingButtonPress',
    PLAYER_STOPPED: 'playerStopped',
    PLAYER_STARTED: 'playerStarted',
    RECORDER_STOPPED: 'recorderStopped',
    RECORDER_STARTED: 'recorderStarted',
    STATE_CHANGED: 'stateChanged',
    START_STOP_PLAY_BUTTON_PRESS: 'startStopPlayButtonPress',
    SEND_AUDIO_FILE_BUTTON_PRESS: 'sendAudioFileButtonPress',
    UPDATE_DEVICE_STATE: 'updateDeviceState',
    SYNC_PROCESS: 'syncProcess',
    SEND_DEVICE_MESSAGE: 'sendDeviceMessage',
    SCROLL_CONNECTION_SELECT: 'scrollConnectionSelect',
    APPLICATION_STARTUP: 'applicationStartup',
    GET_FILE: 'getFile',
    DEV_KILL_FILE_STORAGE: 'devKillFileStorage',
    SCHEDULE_MIDNIGHT: 'schedule_midnight'
  }
}