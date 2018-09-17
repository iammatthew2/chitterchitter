const fs = require('fs');
const promisify = require('util').promisify;
const storage = require('node-persist');
const config = require('../util/config');
const { deviceState } = require('../util/deviceStateStore');

const fsUnlinkAsync = promisify(fs.unlink);
const deviceIsReady = config.deviceStates.ready;
const deviceStateStorageKey = 'deviceState';

async function init() {
  if (!storage.defaultInstance) {
    await storage.init();
  }
  storage.getItem(deviceStateStorageKey).then((stateValue) => {
    if (stateValue !== deviceIsReady) {
      newDeviceSetup();
    }
  });
}

async function killStorage(){
  await storage.clear();
}

function dumbRandomStringMaker() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function assignNewNamesForFiles(files) {
  return files.map((item) => {
    const generatedFileName = `${dumbRandomStringMaker()}.wav`;
    console.log(`... ${item} will be set as ${generatedFileName}`);
    return storage.setItem(item, generatedFileName);
  });
}

async function newDeviceSetup(){
  console.log('Setting up new device...');
  const listOfFiles = Object.keys(deviceState.audioOutFileNames);
  let requests = assignNewNamesForFiles(listOfFiles);
  await Promise.all(requests)
    .then(() => {
      console.log(`... setting ${deviceStateStorageKey} as ${deviceIsReady}`);
      storage.setItem(deviceStateStorageKey, deviceIsReady)
    }).then(() => {
      readSlotsFromStorage();
    });
  }

function readSlotsFromStorage() {
  storage.forEach(async function(datum) {
    if (datum.key.includes('slot')) {
      console.log(`setting deviceState.audioOutFileNames.${datum.key} to '${datum.value}'`);
      deviceState.audioOutFileNames[datum.key] = datum.value;
    }
  });
}

function deleteFiles(files) {
  let deleteFilesProms = [];
  files.forEach(() => {
    deleteFilesProms.push(fsUnlinkAsync(file));
  });
  Promise.all(deleteFilesProms).then(() => {
    console.log('Files successfully deleted');
  });
}

module.exports = {
  init,
  readSlotsFromStorage,
  deleteFiles,
  killStorage
}