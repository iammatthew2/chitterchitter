const path = require('path');
const topLevelDirectory = path.dirname(require.main.filename);

const audioOutPath = path.join(topLevelDirectory, 'audio', 'created');
const audioInPath = path.join(topLevelDirectory, 'audio', 'received');

const IS_DEBUG = false;

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
  },
  defaultThrottleRate: 500,
  playerOptions: {
    filename: AUDIO_FILES.audioOut,
    gain: 10,
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
    lights: {
      green: 15,
      red: 16
    }
  },
  events: {
    START_STOP_RECORD_BUTTON_PRESS: 'StartStopRecordButtonPress',
    START_STOP_PLAY_BUTTON_PRESS: 'StartStopPlayButtonPress',
    SEND_AUDIO_FILE_BUTTON_PRESS: 'sendAudioFileButtonPress',
    APPLICATION_STARTUP: 'applicationStartup',
  }
}