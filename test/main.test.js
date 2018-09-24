const config = require('../app/util/config');
const eventBus = require('../app/util/eventBus');
const recorder = require('../app/modules/record');
const player = require('../app//modules/play');
const { downloadFiles } = require('../app/util/sendReceiveHelpers');
jest.mock('../app/services/iotHubInterface');

const events = config.events;
jest.spyOn(eventBus, 'emit');


beforeAll(() => {
  require('../app/app').appStartUp();
});

test('Recorder starts and stops', done => {
  eventBus.on(events.RECORDER_STARTED, () => {
    recorder.stopRecording();
  });

  eventBus.on(events.RECORDER_STOPPED, () => done());
  recorder.startRecording(Object.assign({ file: 'test.wav' }, config.recorderOptions));
});

test('Player plays and stops playing', done => {
  eventBus.on(events.PLAYER_STARTED, () => done());
  player.startPlaying(Object.assign({ filename: 'test.wav' }, config.playerOptions));
});

test('iotHub can download file', done => {
  downloadFiles().then(done);
});

