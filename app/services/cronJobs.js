const eventBus = require('../util/eventBus');
const events = require('../util/config').events;

const CronJob = require('cron').CronJob;

/*
Cronjob example times:
  midnight: '0 0 * * *'
  6:40pm: '40 18 * * *'
  9:20am: '20 9 * * *'
*/

const midnightJob = new CronJob('0 0 * * *', () =>
  eventBus.emit(events.SCHEDULE_MIDNIGHT));

module.exports = {
  scheduleMidnightEvent: () => {
    if (!midnightJob.running) {
      midnightJob.start();
    }
  },
};
