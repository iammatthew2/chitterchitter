const iotHubInterface = require('../services/iotHubInterface');
const fileProcesses = require('../services/fileProcesses');

/*
abcTwin = {
  slot1: 'qrx',
  slot2: 'efg',
  slot1Send: 'qrxRandomlyGeneratedName',
  slot2Send: 'efgRandomlyGeneratedName',
  slot1Receive: 'qrxOtherGeneratedName',
  slot2Receive: 'efgOtherGeneratedName'
};

qrxTwin = {
  slot1: 'wrt',
  slot2: 'efg',
  slot1Send: 'wrtRandomlyGeneratedName',
  slot2Send: 'efgRandomlyGeneratedName',
  slot1Receive: 'wrtOtherRandomlyGeneratedName',
  slot2Receive: 'efgOtherRandomlyGeneratedName'
};
*/


const dummyFileName =
  'https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav';

const sendDeviceMessageContent = {
  messageText: 'this is the new msg Obj - yts it is',
  sendToDeviceId: 'abc123', // twin slot1
  sendFromDeviceId: 'abc123',
  audioFile: 'someFile', // twin slot1Send
};
const myTempDeviceID = 'abc123';
sendDeviceMessageContent[`audioFromDevice${myTempDeviceID}`] = 'hashedFileName';

// source, name
const downloadFileSet = [
  [dummyFileName, 'slot1In.wav'],
  [dummyFileName, 'slot2In.wav'],
  [dummyFileName, 'slot3In.wav'],
];

const uploadFileSet = [
  '8g8v1.wav',
  'JoNM2.wav',
  'VZYQE.wav',
  'qslot1In.wav',
];

sendDeviceMessageContent.narfFiles = uploadFileSet;
module.exports.sendDeviceMessage = () =>
  iotHubInterface.sendMesssage(sendDeviceMessageContent);

module.exports.downloadFiles = () => iotHubInterface.batchDownload(downloadFileSet)
    .then(() => console.log('all files downloaded'));

module.exports.uploadFilesSequence = () => {
  fileProcesses.readSendQue()
      .then(iotHubInterface.batchUpload)
      .then(fileProcesses.deleteFiles)
      .then(fileProcesses.killSendQue)
      .then(fileProcesses.assignNewNamesForFiles)
      .catch(err => console.log(`error in uploadFilesSequence: ${err}`));
};

module.exports.updateDeviceState = () =>
  iotHubInterface.updateDeviceState({ narf: 'crackers! this is new' });
