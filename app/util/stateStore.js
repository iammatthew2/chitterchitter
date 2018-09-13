const config = require('../util/config');
const eventBus = require('../util/eventBus');

// the current state for all entities - the setting here defines initial state
// for caching, try adding fetching and setting state to env var
const stateStore = {
  player: 'notPlaying',
  recorder: 'notRecording',
  currentConnection: 'a'
}

// possible states for all entities
const stateStatusOptions = {
  player: ['playing', 'notPlaying'],
  recorder: ['recording', 'notRecording'],
  currentConnection: ['a', 'b', 'c', 'd', 'e']
}

// items whose state is being tracked
const entities = {
  player: 'player',
  recorder: 'recorder',
  currentConnection: 'currentConnection'
}

const directions = config.directions || {
  forward: 'forward',
  back: 'back'
}

function change(entity, direction, force) {
  console.log('args: ',arguments)
  const nextState = force ? force : getNextState(entity, direction);
  stateStore[entity] = nextState;
  console.log(`new state for ${entity} - it will now be ${nextState}`);
  eventBus.emit(config.events.STATE_CHANGED);
}

/**
 * Given a entity, get the next state from an array of options
 * We treat the array as circular so reaching the end of state
 * options means we start back at the beginning.
 * @param {*} entity
 * @param {*} direction 
 */
function getNextState(entity, direction = directions.forward) {
  const shouldMoveForward = direction === directions.forward;
  const itemOptions = stateStatusOptions[entity];
  const lengthFromZero = itemOptions.length -1;
  const currentIndex = itemOptions.indexOf(stateStore[entity]);
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

  if (config.dev.isDebug) {
    console.log(`stateStore is changing ${entity} state to ${itemOptions[newIndex]}`);
  }
  
  return itemOptions[newIndex];
}

module.exports = { change, entities, stateStore };