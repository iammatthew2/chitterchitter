const config = require('../app/util/config');
const eventBus = require('../app/util/eventBus');
const { toggleStartStopRecording, toggleStartStopPlaying, toggleListenRecording } = require('../app/util/audioHelpers');
const player = require('../app//modules/play');
const recorder = require('../app/modules/record');
const events = config.events;

const mockClass =  {
  eventStartUpMockFn: () => {},
  eventRecorderStartedFn: () => {}
};

const eventStartUpSpy = jest.spyOn(mockClass, 'eventStartUpMockFn');
const eventRecorderStartedSpy = jest.spyOn(mockClass, 'eventRecorderStartedFn');

beforeAll(() => {
  eventBus.on(events.APPLICATION_STARTUP, eventStartUpSpy);
  require('../app/app').appStartUp();
});

test('Application startup is emitted', () => {
  expect(eventStartUpSpy).toHaveBeenCalled();
});

test('recorder plays then records', () => {
 eventBus.on(config.events.RECORDER_STARTED, eventRecorderStartedSpy);

  recorder.startRecording(Object.assign({file: 'test.wav'}, config.recorderOptions));
  debugger;
 jest.runAllTimers();
  debugger;
  expect(eventRecorderStartedSpy).toHaveBeenCalled();
});
