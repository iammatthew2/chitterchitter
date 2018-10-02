/**
  * The Device State Store manages state for the device by saving state to disk.
  * Settings here will be cached on device reboot.
  * @param {*} slotName
  */
function addToSendQue(slotName) {
  debugger;
  if (!deviceState.deviceStateQue.includes(slotName)) {
    deviceState.deviceStateQue.push(slotName);
    console.log(`added ${slotName} to: ${deviceState.deviceStateQue}`);
  }
}

function getReceivedSlotState(slot) {
  return deviceState.receivedFilesStates[slot];
}

function setReceivedSlotState(slot) {
  deviceState.receivedFilesStates[slot] = state;
}

const deviceState = {
  audioOutFileNames: {
    // TODO: simplify this flow by giving the file a hashed name during file upload
    // sequence
    slot1: '',
    slot2: '',
    slot3: '',
    slot4: '',
    slot5: '',
  },
  // plan to keep saving this to disk so connectivity is not required when a user
  // marks an audio file for upload
  deviceStateQue: [],

  // 'played', 'unplayed', 'empty'
  receivedFilesStates: {
    slot1: '',
    slot2: '',
    slot3: '',
    slot4: '',
    slot5: '',
  },
};

module.exports = { deviceState, addToSendQue };
