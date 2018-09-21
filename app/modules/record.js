const mic = require('mic');
const fs = require('fs');
const eventBus = require('../util/eventBus');
const config = require('../util/config');
const player = require('../modules/play');

let micInstance;
let micInputStream;
let outputFileStream;
let timer;

function attachListeners(stream){
  stream.on('startComplete', () => {
    console.log('recording started');
    eventBus.emit(config.events.RECORDER_STARTED)
  });
  stream.on('stopComplete', () => {
    console.log('recording stopped');
    eventBus.emit(config.events.RECORDER_STOPPED);
  });
}

function setupRecordingInstance(options) {
  micInstance = mic(options);
  micInputStream = micInstance.getAudioStream();

  // TODO: rename file to fileName like in player.js
  outputFileStream = fs.WriteStream(options.file);

  micInputStream.pipe(outputFileStream);

  micInputStream.on('error', error => console.log("MIC - Error in Input Stream: " + error));
  attachListeners(micInputStream);
  if (options.isDebug) {
    console.log(`Recording to file: ${options.file}`);
    micInputStream.on('data', data => console.log("MIC - Recieved Input Stream: " + data.length));
  }
}

function _startRecording(options) {
  setupRecordingInstance(options);
  micInstance.start();
}

/**
 * Wrap setTimeout for testing
 * @param {*} cb
 */
function delayCall(cb) {
  timer = setTimeout(cb, 1820);
}

module.exports = {
  startRecording: function(options){
    player.startPlaying(config.preRecordPlayerOptions);
    const fncArg = () => _startRecording(options);
    delayCall(fncArg);
  },

  stopRecording: function(){
    clearTimeout(timer)
    if (micInstance && micInstance.stop) {
      micInstance.stop();
      micInstance = null;
      micInputStream = null;
      outputFileStream = null;
    }
  }
};