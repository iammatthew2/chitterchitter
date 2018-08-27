const config = require.main.require('./util/config');
const mic = require('mic');
const fs = require('fs');

const micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: true,
    exitOnSilence: 6
});
const micInputStream = micInstance.getAudioStream();

const outputFileStream = fs.WriteStream(config.audioFiles.audioOut);

micInputStream.pipe(outputFileStream);

module.exports = {
  startRecording: micInstance.start, 
  stopRecording: micInstance.stop,
  micInputStream
}