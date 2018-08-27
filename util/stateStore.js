// AltstateStatusOptions = [
//     {
//       name: 'recordingState',
//       curentState: false,
//       options: [false, true]
//     },
//     {
//       name: 'narfs',
//       curentState: false,
//       options: [false, true]
//     }
//   ];


const stateStatusStore = {
  currentlyRecording: false,
  currentlyPlaying: false,
  playSource: 'recorded', // options: recorded or received
  receivedSelected: 'a' // options: 'a', 'b'...
}

const stateStatusOptions = {
  currentlyRecording: [false, true],
  currentlyPlaying: [false, true],
  playSource: ['recorded', 'received'],
  receivedSelected: ['a', 'b', 'c', 'd', 'e']
}

const states = {
  currentlyRecording: 'currentlyRecording',
  currentlyPlaying: 'currentlyPlaying',
  playSource: 'playSource',
  receivedSelected: 'receivedSelected'
}

const directions = {
  forward: 'forward',
  back: 'back'
}

//change(states.currentlyRecording, direction.forward)
function change(property, direction = directions.forward) {
  const moveForward = direction === directions.forward;
  const itemOptions = stateStatusOptions[property];
  const lengthFromZero = itemOptions.length -1;
  const currentIndex = itemOptions.indexOf(stateStatusStore[property]);
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

  // the new index is good. Assign it.
  console.log(`changing ${property} state to ${itemOptions[newIndex]}`);
  stateStatusStore[property] = itemOptions[newIndex]; 
}

module.exports = { change, states, stateStatusStore, directions };