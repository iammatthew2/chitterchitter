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

const filename = 'dummyUpload.wav';


const sendDeviceMessageContent = {
  messageText: 'this is the new msg Obj',
  sendToDeviceId: 'abc123', // twin slot1
  sendFromDeviceId: 'abc123',
  audioFile: 'someFile' //twin slot1Send
}
const myTempDeviceID = 'abc123';
sendDeviceMessageContent[`audioFromDevice${myTempDeviceID}`] = 'hashedFileName';

module.exports.sendDeviceMessage = () => {
  iotHubInterface.iotHubActions.sendMesssage(sendDeviceMessageContent);
}

module.exports.downloadFile = () => iotHubInterface.iotHubActions.download();


module.exports.uploadFile = () => {
  iotHubInterface.iotHubActions.upload(filename);
}

module.exports.updateDeviceState = () => {
  iotHubInterface.iotHubActions.updateDeviceState({ narf: 'this is new' })
}
