/*
import and init mic
import eventsBus and emit events from the recording session

export methods: startRecording, stopRecording
*/

const config = require.main.require('./constants/config');


const mic = require('mic');
const fs = require('fs');

const micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: true,
    exitOnSilence: 6
});
const micInputStream = micInstance.getAudioStream();

const outputFileStream = fs.WriteStream(`${config.filePaths.audioOut}${config.fileNames.audioOut}`);

micInputStream.pipe(outputFileStream);

micInputStream.on('data', data => console.log("MIC - Recieved Input Stream: " + data.length));

micInputStream.on('error', error => console.log("MIC - Error in Input Stream: " + error));

micInputStream.on('startComplete', function() {
  console.log("MIC - Got SIGNAL startComplete");
  setTimeout(function() {
          micInstance.pause();
  }, 5000);
});
  
micInputStream.on('stopComplete', function() {
  console.log("MIC - Got SIGNAL stopComplete");
});
  
micInputStream.on('pauseComplete', function() {
  console.log("MIC - Got SIGNAL pauseComplete");
  setTimeout(function() {
      micInstance.resume();
  }, 5000);
});

micInputStream.on('resumeComplete', function() {
  console.log("MIC - Got SIGNAL resumeComplete");
  setTimeout(function() {
      micInstance.stop();
  }, 5000);
});

micInputStream.on('silence', function() {
  console.log("MIC - Got SIGNAL silence");
});

micInputStream.on('processExitComplete', function() {
  console.log("MIC - Got SIGNAL processExitComplete");
});


module.exports = {
  startRecording: micInstance.start, 
  stopRecording: micInstance.stop
}