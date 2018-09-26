/**
  * The Device State Store manages state for the device by saving state to disk.
  * Settings here will be cached on device reboot.
  * @param {*} selectedSlot
  */
function addToSendQue(recordingFileName) {
  if (!deviceState.deviceStateQue.includes(recordingFileName)) {
    deviceState.deviceStateQue.push(recordingFileName);
    console.log(`added ${recordingFileName} to: ${deviceState.deviceStateQue}`);
  }
}

const deviceState = {
  deviceId: '',
  audioOutFileNames: {
    // we do rename audio out to make it clear that we are sending out new data
    // files. This is something that might change. Must consider use case of
    // uploading then deleting files
    slot1Send: '',
    slot2Send: '',
    slot3Send: '',
    slot4Send: '',
    slot5Send: '',
  },
  deviceStateQue: [],
};

module.exports = { deviceState, addToSendQue };
