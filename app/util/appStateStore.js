/**
 * The App State Store manages state for the current app instance.
 * Settings here will be reset on device reset or reboot.
 *
 * Items stored here are either regenerated on reboot (reset the current connection
 * to index zero) or they are populated via an api request to the iot hub ({connections}).
 *
 * For those items that are populated via the iot hub, we only need that data when
 * we are making an api request (we only need to know the {connections} when sending
 * a message to the hub to notify connected devices of the new file).
 *
 * This device should operate normally so long as it can connect to the internet every
 * now and then.
 *
 */

const storage = require('node-persist');
const config = require('./config');

const directions = config.directions;
const deviceIsReady = config.deviceStates.ready;
const deviceStateStorageKey = 'deviceState';


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
async function _init() {
  if (!storage.defaultInstance) {
    await storage.init();
  }
  storage.getItem(deviceStateStorageKey).then(stateValue => {
    if (stateValue !== deviceIsReady) {
      _newDeviceSetup();
    } else {
      storage.getItem(entities.deviceStateQue)
          .then(i => change({ entity: entities.deviceStateQue, value: [] }));
    }
  });
}

// the current state for all entities - the setting here defines initial state
// for caching, try adding fetching and setting state to env var
const appState = Object.seal({
  player: 'notPlaying',
  recorder: 'notRecording',
  currentConnection: 'slot1',
  connections: {},
  deviceStateQue: [],
});

// possible states for all entities that have predefined options
// These are the states that can be "rotated through" via _getNextState()
const stateStatusOptions = {
  player: ['playing', 'notPlaying'],
  recorder: ['recording', 'notRecording'],
  currentConnection: ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'],
};

// items whose state is being tracked
const entities = {
  player: 'player',
  recorder: 'recorder',
  currentConnection: 'currentConnection',
  connections: 'connections',
  deviceStateQue: 'deviceStateQue',
};

const entitiesPreservedOnDisk = [entities.deviceStateQue];

/**
 * Update the state by assigning a specific value, specifying a direction to
 * move to (in array ['a','b','c'] move from index 2 to 1), or patch an
 * object by giving a new or updated top-level property
 * @param {*} entity - required
 * @param {*} direction
 * @param {*} value
 */
function change({ entity, direction, value, patch }) {
  if (!entity || (!direction && !value && !patch)) {
    console.error('entity and any of direction, value or patch are required');
    return;
  }

  let nextState;

  if (direction) {
    nextState = _getNextState(entity, direction);
  } else if (value) {
    nextState = value;
  } else if (patch) {
    nextState = _getPatchState(entity, patch);
  }

  console.info(`new state for ${entity} - it will now be ${nextState}`);
  appState[entity] = nextState;

  if (entitiesPreservedOnDisk.includes(entity)) {
    return storage.setItem(entity, nextState)
        .then(Promise.resolve(nextState));
  } else {
    return Promise.resolve(nextState);
  }
}

/**
 * Create a new entity with the new items patched in
 * @param {String} entity
 * @param {Object or Array} patch - item to add to current entity
 * @return newState
 */
function _getPatchState(entity, patch) {
  const entityElement = appState[entity];
  let newState;
  if (Array.isArray(entityElement)) {
    newState = entityElement.slice(0);
    newState.push(patch);
  } else {
    newState = Object.assign({}, entityElement);
    Object.keys(patch).forEach(i => {
      newState[i] = patch[i];
    });
  }

  return newState;
}

/**
 * Given an entity, get the next state from an array of options
 * We treat the array as circular so reaching the end of state
 * options means we start back at the beginning.
  * @param {*} entity
  * @param {*} direction
  * @return {Array}
  */
function _getNextState(entity, direction) {
  const shouldMoveForward = direction === directions.forward;
  const itemOptions = stateStatusOptions[entity];
  const lengthFromZero = itemOptions.length -1;
  const currentIndex = itemOptions.indexOf(appState[entity]);
  let newIndex = shouldMoveForward ? currentIndex + 1 : currentIndex -1;

  if (newIndex < 0) {
    // we have tried to decrement the array index and are now at a negative value
    // so circle back to the end of the array
    newIndex = lengthFromZero;
  } else if (newIndex > lengthFromZero) {
    // we have tried to increment the array index and are now beyond the end of the array
    // so circle back to the beginning of the array
    newIndex = 0;
  }

  return itemOptions[newIndex];
}

// only export our the the current state, the method for updating the state
// and the set of entity id's that we track

_init();
module.exports = { change, entities, appState };
