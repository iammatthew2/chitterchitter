const eventBus = require('../util/eventBus');
const config = require('../util/config');
const deviceStateStore = require('../util/deviceStateStore');
const fileProcesses = require('./fileProcesses');
const { toggleStartStopRecording, toggleStartStopPlaying,
  toggleListenRecording } = require('../util/audioHelpers');
const { sendDeviceMessage, downloadFiles, uploadFilesSequence,
  updateDeviceState } = require('../util/sendReceiveHelpers');
const { change, entities, appState } = require('../util/appStateStore');

const events = config.events;

/**
 * begin watching for events
 */
function init() {
  eventBus.on(events.APPLICATION_STARTUP, () => fileProcesses.readSlotsFromStorage());
  eventBus.on(events.RECEIVED_CLOUD_STATE, evt => {
    if (evt && evt.connections) {
      change({ entity: entities.connections, value: evt.connections });
    }
  });
  eventBus.on(events.RECEIVED_CLOUD_STATE_PATCH, evt => {
    if (evt && evt.connections) {
      change({ entity: entities.connections, patch: evt.connections });
      // todo: delete the old file in this flow
      const patch = {};
      patch[entities.connections] = appState.connections;
      updateDeviceState(patch);
    }
  });
  eventBus.on(events.SCROLL_CONNECTION_SELECT, evt => {
    if (evt && config.directions[evt]) {
      change({ entity: entities.currentConnection, direction: config.directions[evt] });
    }
  });
  eventBus.on(events.PLAYER_STARTED, () =>
    change({ entity: entities.player, value: 'playing' })
  );
  eventBus.on(events.PLAYER_STOPPED, () =>
    change({ entity: entities.player, value: 'notPlaying' })
  );
  eventBus.on(events.RECORDER_STARTED, () =>
    change({ entity: entities.recorder, value: 'recording' })
  );
  eventBus.on(events.RECORDER_STOPPED, () =>
    change({ entity: entities.recorder, value: 'notRecording' })
  );
  eventBus.on(events.SCHEDULE_MIDNIGHT, () => uploadFilesSequence());
  eventBus.on(events.DEV_DIRECT_UPLOAD, () => uploadFilesSequence());
  eventBus.on(events.DEV_KILL_FILE_STORAGE, () => fileProcesses.killStorage());
  eventBus.on(events.START_STOP_RECORD_BUTTON_PRESS, toggleStartStopRecording);
  eventBus.on(events.LISTEN_RECORDING_BUTTON_PRESS, toggleListenRecording);
  eventBus.on(events.START_STOP_PLAY_BUTTON_PRESS, toggleStartStopPlaying);
  eventBus.on(events.SEND_AUDIO_FILE_BUTTON_PRESS, () => {
    // this mess is why both state modules need to be combined
    const file =
      deviceStateStore.deviceState.audioOutFileNames[`${appState.currentConnection}Send`];
    fileProcesses.doesFileExist(`./audio/created/${file}`)
        .then(() => {
          deviceStateStore.addToSendQue(file);
          fileProcesses.writeToStorage(deviceStateStore.deviceState.deviceStateQue);
        })
        .catch(err => console.error(`unable to add file (${file}) to que -  ${err}`));
  });
  eventBus.on(events.GET_FILE, downloadFiles);
  eventBus.on(events.SEND_DEVICE_MESSAGE, sendDeviceMessage);
}

module.exports = { init };
