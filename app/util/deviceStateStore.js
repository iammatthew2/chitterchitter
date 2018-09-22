/**
  * The Device State Store manages state for the device by saving state to disk.
  * Settings here will be cached on device reboot.
  * @param {*} selectedSlot
  */
function addToSendQue(selectedSlot) {
  if (!deviceState.filesReadyToSendUp.includes(selectedSlot)) {
    deviceState.filesReadyToSendUp.push(
        deviceState.audioOutFileNames[`${selectedSlot}Send`]
    );
    console.log(
        `The ${selectedSlot} was added to the que - que: ${
          deviceState.filesReadyToSendUp
        }`
    );
  }
}

const deviceState = {
  deviceId: '',
  audioOutFileNames: {
    // we do rename audio out to make it clear that we are sending out new data
    // files. This is something that might change.
    slot1Send: '',
    slot2Send: '',
    slot3Send: '',
    slot4Send: '',
    slot5Send: '',
  },
  filesReadyToSendUp: [],
};

module.exports = { deviceState, addToSendQue };
