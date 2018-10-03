const fs = require('fs');
const promisify = require('util').promisify;
const storage = require('node-persist');
const config = require('../util/config');
const deviceState = require('../util/appStateStore').appState.deviceStateQue;
const fsUnlinkAsync = promisify(fs.unlink);
const deviceIsReady = config.deviceStates.ready;
const deviceStateStorageKey = 'deviceState';
const fsStatAsync = promisify(fs.stat);


const killStorage = () => storage.clear();
const writeToStorage = value => storage.setItem('deviceStateQue', value);
const readSendQue = () => storage.getItem('deviceStateQue');
const killSendQue = () => storage.removeItem('deviceStateQue') && killDeviceStateQue();
const killDeviceStateQue = () => deviceState.deviceStateQue = [];
const doesFileExist = file => fsStatAsync(file);

/**
 * Prepare a new device
 * This should only get called for a new or reset device
 */
async function _newDeviceSetup() {
  console.log('Setting up new device...');
  console.log(`... setting ${deviceStateStorageKey} as ${deviceIsReady}`);
  storage.setItem(deviceStateStorageKey, deviceIsReady);
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
      _newDeviceSetup();
    } else {
      readSendQue().then(i => {
        deviceState.deviceStateQue = i ? i : [];
      });
    }
  });
}

/**
 * Delete an array of files from the device
 * @param {Array} files
 * @return {Promise}
 */
function deleteFiles(files) {
  if (files.length < 1) {
    throw new Error('no files to upload');
  }
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
  deleteFiles,
  killStorage,
  writeToStorage,
  readSendQue,
  doesFileExist,
  killSendQue,
};
