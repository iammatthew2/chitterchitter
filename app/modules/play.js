const soundplayer = require('sound-player');
const playerInstance = new soundplayer({});
const eventBus = require('../util/eventBus');
const config = require('../util/config');

playerInstance.on('stop', () => eventBus.emit(config.events.PLAYER_STOPPED));
playerInstance.on('complete', () => eventBus.emit(config.events.PLAYER_STOPPED));
playerInstance.on('play', () => eventBus.emit(config.events.PLAYER_STARTED));
playerInstance.on('resume', () => eventBus.emit(config.events.PLAYER_STARTED));

module.exports = {
  startPlaying: (options) => {
    debugger;
    playerInstance.play(options);
  },
  stopPlaying: () => {
    debugger;
    if (playerInstance && playerInstance.stop) {
      playerInstance.stop();
    }
  },
  pausePlaying: () => playerInstance.pause(),
  resumePlaying: () => playerInstance.resume()
}