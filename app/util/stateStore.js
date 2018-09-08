const config = require('../util/config');
const eventBus = require('../util/eventBus');


const stateStore = {
  player: 'notPlaying',
  recorder: 'notRecording',
}

const stateStatusOptions = {
  player: ['playing', 'notPlaying'],
  recorder: ['recording', 'notRecording'],
}

const properties = {
  player: 'player',
  recorder: 'recorder'
}

const directions = {
  forward: 'forward',
  back: 'back'
}

//change(properties.currentlyRecording, direction.forward)
function change(property, direction, force) {
  const nextState = force ? force : getNextState(property, direction);
  stateStore[property] = nextState;
  console.log(`new state for ${property} - it will now be ${nextState}`);
  eventBus.emit(config.events.STATE_CHANGED);
}

/**
 * Given a property, get the next state from an array of options
 * We treat the array as circular so reaching the end of state
 * options means we start back at the beginning.
 * @param {*} property 
 * @param {*} direction 
 */
function getNextState(property, direction = directions.forward) {
  const moveForward = direction === directions.forward;
  const itemOptions = stateStatusOptions[property];
  const lengthFromZero = itemOptions.length -1;
  const currentIndex = itemOptions.indexOf(stateStore[property]);
  let newIndex = moveForward ? currentIndex + 1 : currentIndex -1;

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
    console.log(`stateStore is changing ${property} state to ${itemOptions[newIndex]}`);
  }
  
  return itemOptions[newIndex];
}

module.exports = { change, properties, stateStore, directions };



/**
 
press stop button
rpio emits 'stop button' pressed
eventManager calls 'stop' on player
player emits 'player_stopped'
event manager calls state store change()
state store emits 'player state update'
event manager
 */