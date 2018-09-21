const fs = require('fs');
const promisify = require('util').promisify;
const storage = require('node-persist');
const config = require('../util/config');
const { deviceState } = require('../util/deviceStateStore');

const fsUnlinkAsync = promisify(fs.unlink);
const deviceIsReady = config.deviceStates.ready;
const deviceStateStorageKey = 'deviceState';

/**
 * Prepare a new device
 * This should only get called for a new or reset device
 */
async function newDeviceSetup() {
  console.log('Setting up new device...');
  const listOfFiles = Object.keys(deviceState.audioOutFileNames);
  let requests = assignNewNamesForFiles(listOfFiles);
  await Promise.all(requests)
      .then(() => {
        console.log(`... setting ${deviceStateStorageKey} as ${deviceIsReady}`);
        storage.setItem(deviceStateStorageKey, deviceIsReady);
      })
      .then(() => {
        readSlotsFromStorage();
      });
}

/**
 * Prepare this instance of storage for this app
 * Called for every run of the application
 */
async function init() {
  if (!storage.defaultInstance) {
    await storage.init();
  }
  storage.getItem(deviceStateStorageKey).then(stateValue => {
    if (stateValue !== deviceIsReady) {
      newDeviceSetup();
    }
  });
}

/**
 * A dev utility for killing storage
 * Keep this around for remote maintanance
 */
async function killStorage() {
  await storage.clear();
}

/**
 * Just like real crypto but dumber and not safe
 * @return {String}
 */
function dumbRandomStringMaker() {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * We provide names for files that will be recorded. After upload
 * those names are regenerated to keep the flow clear
 * @param {*} files
 * @return {Promise}
 */
function assignNewNamesForFiles(files) {
  return files.map(item => {
    const generatedFileName = `${dumbRandomStringMaker()}.wav`;
    console.log(`... ${item} will be set as ${generatedFileName}`);
    return storage.setItem(item, generatedFileName);
  });
}

/**
 * Get the file names from storage and assign them to the deviceState names
 */
function readSlotsFromStorage() {
  storage.forEach(async function(datum) {
    if (datum.key.includes('slot')) {
      console.log(
          `setting deviceState.audioOutFileNames.${datum.key} to '${datum.value}'`
      );
      deviceState.audioOutFileNames[datum.key] = datum.value;
    }
  });
}

/**
 * Delete an array of files from the device
 * @param {Array} files
 */
function deleteFiles(files) {
  let deleteFilesProms = [];
  files.forEach(file => deleteFilesProms.push(fsUnlinkAsync(file)));
  Promise.all(deleteFilesProms).then(() => {
    console.log('Files successfully deleted');
  });
}

module.exports = {
  init,
  readSlotsFromStorage,
  deleteFiles,
  killStorage,
};
