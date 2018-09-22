const eventBus = require('../util/eventBus');
const config = require('../util/config');
const deviceState = require('../util/deviceStateStore');
const fileProcesses = require('./fileProcesses');

const { toggleStartStopRecording, toggleStartStopPlaying,
  toggleListenRecording } = require('../util/audioHelpers');
const { sendDeviceMessage, downloadFiles, uploadFilesSequence,
  updateDeviceState } = require('../util/sendReceiveHelpers');
const { change, entities, appState } = require('../util/appStateStore');

const events = config.events;

/**
 * begin watch for events
 */
function init() {
  eventBus.on(events.APPLICATION_STARTUP, () => fileProcesses.readSlotsFromStorage());
  eventBus.on(events.SCHEDULE_MIDNIGHT, () => uploadFilesSequence());
  eventBus.on(events.DEV_DIRECT_UPLOAD, () => uploadFilesSequence());
  eventBus.on(events.DEV_KILL_FILE_STORAGE, () => fileProcesses.killStorage());
  eventBus.on(events.START_STOP_RECORD_BUTTON_PRESS, toggleStartStopRecording);
  eventBus.on(events.LISTEN_RECORDING_BUTTON_PRESS, toggleListenRecording);
  eventBus.on(events.START_STOP_PLAY_BUTTON_PRESS, toggleStartStopPlaying);
  eventBus.on(events.SCROLL_CONNECTION_SELECT, e => {
    if (e && config.directions[e]) {
      change(entities.currentConnection, config.directions[e]);
    }
  });
  eventBus.on(events.SEND_AUDIO_FILE_BUTTON_PRESS, () => {
    deviceState.addToSendQue(appState.currentConnection);
  });
  eventBus.on(events.GET_FILE, downloadFiles);
  eventBus.on(events.UPDATE_DEVICE_STATE, updateDeviceState);
  eventBus.on(events.SEND_DEVICE_MESSAGE, sendDeviceMessage);
  eventBus.on(events.PLAYER_STOPPED, () => change(entities.player, null, 'notPlaying'));
  eventBus.on(events.PLAYER_STARTED, () => change(entities.player, null, 'playing'));
  eventBus.on(events.RECORDER_STOPPED, () =>
    change(entities.recorder, null, 'notRecording'));
  eventBus.on(events.RECORDER_STARTED, () =>
    change(entities.recorder, null, 'recording'));
}

module.exports = { init };
