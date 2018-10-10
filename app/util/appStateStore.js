/**
 * The App State Store manages state for an current app. State is persisted
 * for entities marked as needing persistence.
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
 * Prepare this instance of storage for this app
 * Called for every run of the application
 */
async function _initPersistStorage() {
  if (!storage.defaultInstance) {
    await storage.init();
  }
  storage.getItem(deviceStateStorageKey).then(stateValue => {
    if (stateValue !== deviceIsReady) {
      console.info('persistStorage: setting up new device');
      storage.setItem(deviceStateStorageKey, deviceIsReady);
    } else {
      entitiesPreservedOnDisk.forEach( i => {
        storage.getItem(i)
            .then(value => {
              console.info(`persistStorage: setting ${i} as ${value}`);
              return change({ entity: i, value });
            })
            .catch(err => console.error(`persistStorage error: ${err}`));
      });
    }
  });
}

// the current state for all entities - the setting here defines initial state
// for caching, try adding fetching and setting state to env var
const appState = {
  player: 'notPlaying',
  recorder: 'notRecording',
  currentConnection: 'slot1',
  //  {slot1: "abc123", slot2: "abcxyz", slot5: "abc456"}
  connections: {},
  deviceStateQue: [],
  receivedFilesStatus: {
    slot1: 'unplayed',
    slot2: 'played',
    slot3: 'empty',
    slot4: 'empty',
    slot5: 'empty',
  },
};

// items whose state is being tracked
const entities = {};
Object.keys(appState).forEach(i => entities[i] = i);

// possible states for all entities that have predefined options
// These are the states that can be "rotated through" via _getNextState()
const stateStatusOptions = {
  player: ['playing', 'notPlaying'],
  recorder: ['recording', 'notRecording'],
  currentConnection: ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'],
};

const entitiesPreservedOnDisk = [entities.deviceStateQue, entities.connections];

/**
 * Create a new entity with the new items patched in
 * @param {String} entity
 * @param {Object} patch - item to add to current entity
 * @return {Object}
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
  const entityOptions = stateStatusOptions[entity];
  const lengthFromZero = entityOptions.length -1;
  const currentIndex = entityOptions.indexOf(appState[entity]);
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

  return entityOptions[newIndex];
}


function get(entity) {
  if (typeof entity === 'object') {
    return Object.freeze(Object.assign({}, appState[entity]));
  } else {
    return appState[entity];
  }
}

/**
 * Update the state by assigning a specific value, specifying a direction to
 * move to (in array ['a','b','c'] move from index 2 to 1), or patch an
 * object by giving a new or updated top-level property
 * @param {*} entity - required
 * @param {*} direction
 * @param {*} value
 * @return {Promise}
 */
function change({ entity, direction, value, patch }) {
  if (!entity || (!direction && !value && !patch)) {
    console.error('change: entity & any of (direction, value, patch) required');
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

  const displayNextState = typeof nextState === 'object' ? JSON.stringify(nextState) : nextState;

  console.info(`change: state for ${entity} to ${displayNextState}`);
  appState[entity] = nextState;

  if (entitiesPreservedOnDisk.includes(entity)) {
    return storage.setItem(entity, nextState)
        .then(Promise.resolve(nextState));
  } else {
    return Promise.resolve(nextState);
  }
}

_initPersistStorage();
// only export our getter and the method for updating the state
module.exports = { change, get };
