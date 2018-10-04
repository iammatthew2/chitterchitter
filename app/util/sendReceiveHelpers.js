const iotHubInterface = require('../services/iotHubInterface');
const fileProcesses = require('../services/fileProcesses');
const appStateStore = require('../util/appStateStore');
const configs = require('./config');
const path = require('path');

const deviceId = 'abc123';

const sendMessageContent = {
  sender: deviceId,
  uploaderNotifications: [],
};

/**
 * Just like real crypto but dumber and not safe
 * @return {String}
 */
function _dumbRandomStringMaker() {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const altSlotToRemoteFileName = slot =>
  path.join(configs.baseRemotePath, deviceId, altSlotToFileName(slot));
const altSlotToFileName = slot => fileNamePairCache[slot];

const fileNamePairCache = {};
function slotToSlotAndNamePair(slot) {
  const newName = `${_dumbRandomStringMaker()}.wav`;
  fileNamePairCache[slot] = newName;
  return { slot, newName };
}

function createMessageContent(queuedSlots) {
  const uploaderInfo = queuedSlots.map(slot => {
    const fileData = {};
    fileData.recipient = appStateStore.appState.connections[slot];
    fileData.file = altSlotToRemoteFileName(slot);
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
  const queuedSlots = appStateStore.appState.deviceStateQue;

  iotHubInterface.batchUpload(queuedSlots.map(slotToSlotAndNamePair))
      .then(files => {
        const theContent = createMessageContent(queuedSlots);
        iotHubInterface.updateDeviceState({ twinContent: theContent });
        iotHubInterface.sendMesssage({ msgContent: theContent });
        return fileProcesses.deleteFiles(files);
      })
      .then(fileProcesses.killSendQue)
      .catch(err => console.error(`error in uploadFilesSequence: ${err}`));
};

module.exports.updateDeviceState = patch => iotHubInterface.updateDeviceState(patch);
