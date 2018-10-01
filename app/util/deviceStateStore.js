/**
  * The Device State Store manages state for the device by saving state to disk.
  * Settings here will be cached on device reboot.
  * @param {*} slotName
  */
function addToSendQue(slotName) {
  if (!deviceState.deviceStateQue.includes(slotName)) {
    deviceState.deviceStateQue.push(slotName);
    console.log(`added ${slotName} to: ${deviceState.deviceStateQue}`);
  }
}

const deviceState = {
  deviceId: '',
  audioOutFileNames: {
    // we do rename audio out to make it clear that we are sending out new data
    // files. This is something that might change. Must consider use case of
    // uploading then deleting files
    slot1: '',
    slot2: '',
    slot3: '',
    slot4: '',
    slot5: '',
  },
  deviceStateQue: [],
};

module.exports = { deviceState, addToSendQue };
