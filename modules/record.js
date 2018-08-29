const config = require.main.require('./constants/config');
const mic = require('mic');
const fs = require('fs');

let micInstance;
let micInputStream;
let outputFileStream;

module.exports = {
  startRecording: function(){
    micInstance = mic({
      rate: '16000',
      channels: '1',
      debug: true,
      exitOnSilence: 6
  });
    micInputStream = micInstance.getAudioStream();

    outputFileStream = fs.WriteStream(`${config.filePaths.audioOut}${config.fileNames.audioOut}`);

    micInputStream.pipe(outputFileStream);

    micInputStream.on('data', data => console.log("MIC - Recieved Input Stream: " + data.length));

    micInputStream.on('error', error => console.log("MIC - Error in Input Stream: " + error));

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