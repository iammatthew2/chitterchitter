const storage = require('node-persist');
const config = require('../util/config');

const deviceIsReady = config.deviceStates.ready;
const deviceStateStorageKey = 'deviceState';
const init = async () => {
   if (!storage.defaultInstance) {
    await storage.init();
  }
};

function dumbRandomStringMaker() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

async function newDeviceSetup(){
  console.log('Setting up new device...');
  const listOfFiles = Object.keys(config.audioOutFileNames)
  let requests = listOfFiles.map((item) => {
    const generatedFileName = `${dumbRandomStringMaker()}.wav`;
    console.log(`... ${item} will be set as ${generatedFileName}`);
    storage.setItem(item,generatedFileName);
  });
  await Promise.all(requests)
    .then(() => {
      console.log(`... setting ${deviceStateStorageKey} as ${deviceIsReady}`);
      storage.setItem(deviceStateStorageKey, deviceIsReady)
    });
  }

function _readSlotsFromStorage() {
  storage.forEach(async function(datum) {
    if (datum.key.includes('slot')) {
      console.log(`setting config.audioOutFileNames.${datum.key} to '${datum.value}'`);
      config.audioOutFileNames[datum.key] = datum.value;
    }
  });
}

module.exports.readFromStorage = async () => {
  init();
  storage.getItem(deviceStateStorageKey).then((stateValue) => {
    if (stateValue === deviceIsReady) {
      _readSlotsFromStorage();
    } else {
      newDeviceSetup().then(_readSlotsFromStorage)
    }
  });
}
