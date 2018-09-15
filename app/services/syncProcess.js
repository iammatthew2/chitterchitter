const storage = require('node-persist');
const config = require('../util/config');

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
  const listOfFiles = Object.keys(config.audioOutFileNames);
  listOfFiles.forEach(async (fileName) => {
    await storage.setItem(fileName,`${dumbRandomStringMaker()}.wav`)
    .then(() => {
      storage.setItem('deviceIsReady', true)
    });
  });
}



function _readFromStorage() {
  storage.forEach(async function(datum) {
    console.log(`setting '${datum.key}' to '${datum.value}'`);
    config.audioOutFileNames[datum.key] = datum.value;
  });
}

module.exports.readFromStorage = async () => {
  init();
  storage.getItem('deviceIsReady').then((status) => {
    if(status) {
      _readFromStorage();
    } else {
      newDeviceSetup().then(_readFromStorage)
    }
  });
}
