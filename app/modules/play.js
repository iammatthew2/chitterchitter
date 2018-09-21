const Soundplayer = require('sound-player');
const playerInstance = new Soundplayer({});
const eventBus = require('../util/eventBus');
const config = require('../util/config');

playerInstance.on('stop', () => eventBus.emit(config.events.PLAYER_STOPPED));
playerInstance.on('complete', () => eventBus.emit(config.events.PLAYER_STOPPED));
playerInstance.on('play', () => eventBus.emit(config.events.PLAYER_STARTED));
playerInstance.on('resume', () => eventBus.emit(config.events.PLAYER_STARTED));

module.exports = {
  startPlaying: options => playerInstance.play(options),
  stopPlaying: () => {
    if (playerInstance && playerInstance.stop) {
      playerInstance.stop();
    }
  },
  pausePlaying: () => playerInstance.pause(),
  resumePlaying: () => playerInstance.resume(),
};
