const iotHubInterface = require('../services/iotHubInterface');
const fileProcesses = require('../services/fileProcesses');

const myTempDeviceID = 'abc123';

const sendMessageContent = {
  sender: myTempDeviceID,
  uploadNotifications: [
    {
      recipient: 'other',
      file: 'file',
    },
    {
      recipient: 'other',
      file: 'file',
    },
  ],
};


module.exports.sendDeviceMessage = () =>
  iotHubInterface.sendMesssage(sendMessageContent);

const dummyFileName =
  'https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav';

// source, name
const downloadFileSet = [
  [dummyFileName, 'slot1In.wav'],
  [dummyFileName, 'slot2In.wav'],
  [dummyFileName, 'slot3In.wav'],
];

module.exports.downloadFiles = () => iotHubInterface.batchDownload(downloadFileSet)
    .then(() => console.info('all files downloaded'));

module.exports.uploadFilesSequence = () => {
  fileProcesses.readSendQue()
      .then(iotHubInterface.batchUpload)
      .then(fileProcesses.deleteFiles)
      .then(fileProcesses.killSendQue)
      .then(fileProcesses.assignNewNamesForFiles)
      .catch(err => console.error(`error in uploadFilesSequence: ${err}`));
};

module.exports.updateDeviceState = patch => iotHubInterface.updateDeviceState(patch);
