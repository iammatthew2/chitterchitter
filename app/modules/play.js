const soundplayer = require('sound-player');
const playerInstance = new soundplayer({});

module.exports = {
  startPlaying: (options) => playerInstance.play(options),
  stopPlaying: () => playerInstance.stop(),
  pausePlaying: () => playerInstance.pause(),
  resumePlaying: () => playerInstance.resume()
}