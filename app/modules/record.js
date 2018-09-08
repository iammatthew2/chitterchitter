const mic = require('mic');
const fs = require('fs');
const eventBus = require('../util/eventBus');
const config = require('../util/config');



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

module.exports = {
  startRecording: function(options){
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
    micInstance.start();
    
  },

  stopRecording: function(){
    if(micInstance.stop) {
      micInstance.stop();
      micInstance = null;
      micInputStream = null;
      outputFileStream = null;
    }
  }
};