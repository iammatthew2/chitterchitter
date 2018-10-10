const iotHubInterface = require('../services/iotHubInterface');
const fileProcesses = require('../services/fileProcesses');
const { change, get } = require('../util/appStateStore');
const config = require('./config');
const entities = config.appStates;
const path = require('path');

const deviceId = process.env.DEVICE_ID;
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
  encodeURIComponent(path.join(config.baseRemotePath, deviceId, altSlotToFileName(slot)));
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
    fileData.recipient = get(entities.connections)[slot];
    fileData.file = altSlotToRemoteFileName(slot);
    return fileData;
  });

  sendMessageContent.uploaderNotifications = uploaderInfo;
  return sendMessageContent;
}


function objectReverser(item) {
  const keys = Object.keys(item);
  const output = {};
  keys.forEach(key => {
    output[item[key]] = key;
  });
  return output;
}

module.exports.downloadManager = files => {
  // files: {abc123: someFilePath}
  // call with [['sourceName', 'localName']
  // iotHubInterface.batchDownload(downloadFileSet).then(() => console.info('all files downloaded'));

  // {slot1: "abc123", slot2: "abcxyz", slot5: "abc456"}
  const connections = get(entities.connections);
  // {"abc123": slot1, "abc456": slot2,
  const idsToSlots = objectReverser(connections);
  const fileSetsToDownload = [];
  Object.keys(files).forEach(fileKey => {
    const file = files[fileKey];
    const slot = idsToSlots[fileKey];
    fileSetsToDownload.push([file, `${slot}.wav`]);
  });

  iotHubInterface.batchDownload(fileSetsToDownload)
      .then(() => console.info('all files downloaded'))
      .catch(e => console.info(`download failure: ${e}`));

  /**
   * What should this method do?
    - download any new file or files
    -- each files should be named based on the slot
    - notify the hub that file was downloaded
    -- the hub will null the desired property
    - mark file as new
   */
};

module.exports.uploadFilesSequence = () => {
  const queuedSlots = get(entities.deviceStateQue);

  iotHubInterface.batchUpload(queuedSlots.map(slotToSlotAndNamePair))
      .then(files => {
        // TODO: refactor slotToSlotAndNamePair so that we send an array of arrays for upload
        // like we do with the download I think
        const theContent = createMessageContent(queuedSlots);
        // iotHubInterface.updateDeviceState({ twinContent: theContent });
        // the above line fails b/c has an array. This can all be done via device twins
        // and can skip the sendMessage. But must get azure function working
        iotHubInterface.sendMesssage({ msgContent: theContent });
        return fileProcesses.deleteFiles(files);
      })
      .then(() => change({ entity: entities.deviceStateQue, value: [] }))
      .catch(err => console.error(`error in uploadFilesSequence: ${err}`));
};

module.exports.updateDeviceState = patch => iotHubInterface.updateDeviceState(patch);
