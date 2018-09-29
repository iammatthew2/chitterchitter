/**
 * The App State Store manages state for the current app instance.
 * Settings here will be reset on device reset or reboot.
 */

const config = require('./config');
const eventBus = require('./eventBus');

// the current state for all entities - the setting here defines initial state
// for caching, try adding fetching and setting state to env var
const appState = {
  player: 'notPlaying',
  recorder: 'notRecording',
  currentConnection: 'slot1',
  connections: {},
};

// possible states for all entities
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
};

const directions = config.directions;

/**
 * Update the state
 * @param {*} entity
 * @param {*} direction
 * @param {*} force
 */
function change(entity, direction, force) {
  // TODO refactor so null is not needed
  // add change patch feature
  const nextState = force ? force : getNextState(entity, direction);
  appState[entity] = nextState;
  console.log(`new state for ${entity} - it will now be ${nextState}`);
  eventBus.emit(config.events.STATE_CHANGED);
}

/**
 * Given an entity, get the next state from an array of options
 * We treat the array as circular so reaching the end of state
 * options means we start back at the beginning.
  * @param {*} entity
  * @param {*} direction
  * @return {Array}
  */
function getNextState(entity, direction = directions.forward) {
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

/**
 * Update the connections state
 * {Object} - reportedConnections
 */
function updateConnectionsState(reportedConnections) {
  appState.connections = reportedConnections;
}

module.exports = { change, entities, appState, updateConnectionsState };
