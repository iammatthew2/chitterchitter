const iotHubInterface = require('../services/iotHubInterface');
const fileProcesses = require('../services/fileProcesses');
const deviceStateStore = require('./deviceStateStore');
const appStateStore = require('../util/appStateStore');
const configs = require('./config');
const path = require('path');

const deviceId = 'abc123';

const sendMessageContent = {
  sender: deviceId,
  uploaderNotifications: [],
};

const slotToRemoteFileName = slot =>
  path.join(configs.baseRemotePath, deviceId, slotToFileName(slot));
const slotToFileName = slot => deviceStateStore.deviceState.audioOutFileNames[slot];

function createMessageContent(queuedSlots) {
  const uploaderInfo = queuedSlots.map(slot => {
    const fileData = {};
    fileData.recipient = appStateStore.appState.connections[slot];
    fileData.file = slotToRemoteFileName(slot);
    return fileData;
  });

  sendMessageContent.uploaderNotifications = uploaderInfo;
  return sendMessageContent;
}

const dummyFileName =
  'https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav';

const downloadFileSet = [
  [dummyFileName, 'slot1In.wav'],
  [dummyFileName, 'slot2In.wav'],
  [dummyFileName, 'slot3In.wav'],
];

module.exports.downloadFiles = () => iotHubInterface.batchDownload(downloadFileSet)
    .then(() => console.info('all files downloaded'));

module.exports.uploadFilesSequence = () => {
  const queuedSlots = deviceStateStore.deviceState.deviceStateQue;

  iotHubInterface.batchUpload(queuedSlots.map(slotToFileName))
      .then(files => {
        const theContent = createMessageContent(queuedSlots);
        iotHubInterface.updateDeviceState({ twinContent: theContent });
        iotHubInterface.sendMesssage({ msgContent: theContent });
        return fileProcesses.deleteFiles(files);
      })
      .then(fileProcesses.killSendQue)
      .then(fileProcesses.assignNewNamesForFiles)
      .catch(err => console.error(`error in uploadFilesSequence: ${err}`));
};

module.exports.updateDeviceState = patch => iotHubInterface.updateDeviceState(patch);
