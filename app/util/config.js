const path = require('path');
let topLevelDirectory = path.dirname(require.main.filename);
topLevelDirectory = topLevelDirectory.replace('/app/test', '');

const IS_DEBUG = true;

module.exports = {
  dev: {
    isMock: true,
    isDebug: IS_DEBUG,
    mockDelay: 1000,
    executeQue: false,
  },
  deviceStates: {
    newDevice: 'newDevice',
    ready: 'ready',
  },
  defaultThrottleRate: 500,
  playerOptions: {
    gain: 10,
    debug: IS_DEBUG,
  },
  uploadFilePath: './audio/created/',
  downloadFilePath: './audio/received/',
  preRecordPlayerOptions: {
    filename: path.join(topLevelDirectory, 'startRecordingPlease.wav'),
    gain: 8,
    debug: IS_DEBUG,
  },
  audioInFileNames: {
    // we do not rename audio in to make it less likely that
    // a bug would cause us to preserve the file when a new file is downloaded
    // from for a slot
    slot1In: 'slot1In.wav',
    slot2In: 'slot2In.wav',
    slot3In: 'slot3In.wav',
    slot4In: 'slot4In.wav',
    slot5In: 'slot5In.wav',
  },
  recorderOptions: {
    rate: '16000',
    channels: '1',
    debug: IS_DEBUG,
    exitOnSilence: 6,
    fileType: 'wav',
  },
  hardware: {
    buttons: {
      startStopRecording: 31,
      startStopListenRecording: 29,
      startStopPlaying: 40,
      sendAudioFile: 36,
    },
    rotaryDial: {
      pwr: 'not sure how this works',
      clk: 'whatever',
    },
    lights: {
      green: 15,
      red: 16,
    },
  },
  directions: {
    forward: 'forward',
    back: 'back',
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
    SEND_DEVICE_MESSAGE: 'sendDeviceMessage',
    SCROLL_CONNECTION_SELECT: 'scrollConnectionSelect',
    APPLICATION_STARTUP: 'applicationStartup',
    RECEIVED_CLOUD_STATE: 'receivedCloudState',
    GET_FILE: 'getFile',
    DEV_KILL_FILE_STORAGE: 'devKillFileStorage',
    DEV_DIRECT_UPLOAD: 'devDirectUpload',
    SCHEDULE_MIDNIGHT: 'schedule_midnight',
  },
};
