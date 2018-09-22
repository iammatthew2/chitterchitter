const iotHubInterface = require('../services/iotHubInterface');

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

const filename1 = './audio/created/8g8v1.wav';
const filename2 = './audio/created/DNzqa.wav';
const filename3 = './audio/created/JoNM2.wav';
const filename4 = './audio/created/PGAZ0.wav';
const filename5 = './audio/created/VZYQE.wav';
const dummyFileName =
  'https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav';

const sendDeviceMessageContent = {
  messageText: 'this is the new msg Obj',
  sendToDeviceId: 'abc123', // twin slot1
  sendFromDeviceId: 'abc123',
  audioFile: 'someFile', // twin slot1Send
};
const myTempDeviceID = 'abc123';
sendDeviceMessageContent[`audioFromDevice${myTempDeviceID}`] = 'hashedFileName';

const fileSet = [
  [dummyFileName, './audio/received/slot1In.wav'],
  [dummyFileName, './audio/received/slot2In.wav'],
  [dummyFileName, './audio/received/slot3In.wav'],
];


module.exports.sendDeviceMessage = () =>
  iotHubInterface.sendMesssage(sendDeviceMessageContent);

module.exports.downloadFiles = () => iotHubInterface.batchDownload(fileSet);

module.exports.uploadFilesSequence = () =>{
  iotHubInterface.upload([filename1, filename2, filename3, filename4, filename5])
      .then(() => {
        console.log('this is when we would delete files');
        // fileProcesses.deleteFiles('[files]');
      });
};

module.exports.updateDeviceState = () =>
  iotHubInterface.updateDeviceState({ narf: 'this is new' });
