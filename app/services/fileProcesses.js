const fs = require('fs');
const promisify = require('util').promisify;
const storage = require('node-persist');
const config = require('../util/config');
const { deviceState } = require('../util/deviceStateStore');
const fsUnlinkAsync = promisify(fs.unlink);
const deviceIsReady = config.deviceStates.ready;
const deviceStateStorageKey = 'deviceState';
const fsStatAsync = promisify(fs.stat);

const audioOutFileNameList = Object.keys(deviceState.audioOutFileNames);

// TODO: move this whole file into util/deviceStateStore as private methods
// except for a few methods that should go to something like util/fileHelpers

const killStorage = () => storage.clear();
const writeToStorage = value => storage.setItem('deviceStateQue', value);
const readSendQue = () => {
  return storage.getItem('deviceStateQue');
};
const killSendQue = () => storage.removeItem('deviceStateQue') && killDeviceStateQue();
const killDeviceStateQue = () => deviceState.deviceStateQue = [];
const doesFileExist = file => fsStatAsync(file);

/**
 * Prepare a new device
 * This should only get called for a new or reset device
 */
async function newDeviceSetup() {
  console.log('Setting up new device...');
  let requests = assignNewNamesForFiles();
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
 * Just like real crypto but dumber and not safe
 * @return {String}
 */
function dumbRandomStringMaker() {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * We provide names for files that will be recorded. After upload
 * those names are regenerated to keep the flow clear
 * @return {Promise}
 */
function assignNewNamesForFiles() {
  return audioOutFileNameList.map(item => {
    const generatedFileName = `${dumbRandomStringMaker()}.wav`;
    deviceState.audioOutFileNames[item] = generatedFileName;
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
 * @return {Promise}
 */
function deleteFiles(files) {
  let deleteFilesProms = [];
  files.map(filename => `${config.uploadFilePath}${filename}`)
      .forEach(file => {
        console.log(`deleting ${file}`);
        deleteFilesProms.push(fsUnlinkAsync(file));
      });
  return Promise.all(deleteFilesProms);
}

module.exports = {
  init,
  readSlotsFromStorage,
  deleteFiles,
  killStorage,
  writeToStorage,
  assignNewNamesForFiles,
  readSendQue,
  doesFileExist,
  killSendQue,
};
