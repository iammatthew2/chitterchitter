const path = require('path');
const topLevelDirectory = path.dirname(require.main.filename);

const audioOutPath = path.join(topLevelDirectory, 'audio', 'created');
const audioInPath = path.join(topLevelDirectory, 'audio', 'received');

const IS_DEBUG = true;

const AUDIO_FILES = {
  audioOut: path.join(audioOutPath, 'out.wav'),
  audioInA: path.join(audioOutPath, 'dummy.wav'),
  audioInB: path.join(audioInPath, 'audioInB')
};

module.exports = {
  dev: {
    isMock: true,
    isDebug: IS_DEBUG,
    mockDelay: 1000,
    executeQue: false
  },
  defaultThrottleRate: 500,
  playerOptions: {
    filename: AUDIO_FILES.audioOut,
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
    file: AUDIO_FILES.audioOut,
    fileType: 'wav'
  }, 
  hardware: {
    buttons: {
      startStopRecording: 31,
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
  events: {
    START_STOP_RECORD_BUTTON_PRESS: 'startStopRecordButtonPress',
    PLAYER_STOPPED: 'playerStopped',
    PLAYER_STARTED: 'playerStarted',
    RECORDER_STOPPED: 'recorderStopped',
    RECORDER_STARTED: 'recorderStarted',
    STATE_CHANGED: 'stateChanged',
    START_STOP_PLAY_BUTTON_PRESS: 'startStopPlayButtonPress',
    SEND_AUDIO_FILE_BUTTON_PRESS: 'sendAudioFileButtonPress',
    UPDATE_DEVICE_STATE: 'updateDeviceState',
    SCROLL_CONNECTION_SELECT: 'scrollConnectionSelect',
    APPLICATION_STARTUP: 'applicationStartup',
    GET_FILE: 'getFile'
  }
}