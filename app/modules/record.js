const mic = require('mic');
const fs = require('fs');
const eventBus = require('../util/eventBus');
const config = require('../util/config');
const player = require('../modules/play');

let micInstance;
let micInputStream;
let outputFileStream;

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

let timer;

module.exports = {
  startRecording: function(options){
    player.startPlaying(config.preRecordPlayerOptions);
    debugger;
    timer = setTimeout(() => {
      debugger;
      setupRecordingInstance(options);
      micInstance.start();
    }, 1820);
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