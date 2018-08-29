const soundplayer = require('sound-player');
const playerInstance = new soundplayer({});

// module.exports = {
//   startPlaying: playerInstance.play,
//   stopPlaying: playerInstance.stop,
//   pausePlaying: playerInstance.pause,
//   resumePlaying: playerInstance.resume
// }

module.exports = playerInstance;