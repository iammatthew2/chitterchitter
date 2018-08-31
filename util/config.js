const path = require('path');
const topLevelDirectory = path.dirname(require.main.filename);

const audioOut = path.join(topLevelDirectory, 'audio', 'created','out.raw');
const audioIn = path.join(topLevelDirectory, 'audio', 'received');

module.exports = {
  isMock: true,
  mockDelay: 1000,
  defaultThrottleRate: 500,
  audioFiles: {
    audioOut: audioOut,
    audioInA: path.join(audioIn, 'dummy.wav'),
    audioInB: path.join(audioIn, 'audioInB')
  },
  playerOptions: {
    filename: audioOut,
    gain: 10,
    debug: true
  }
}