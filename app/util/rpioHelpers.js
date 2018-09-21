const rpio = require('rpio');
const configs = require('./config');

const queOfCallbacks = [];
let currentQuePosition = 0;

/**
 * RPIO has some mocking ability, but falls short of polling pins
 * @param {*} pin
 * @param {*} callBack
 * @param {*} pinSetting
 */
function safePoll(pin, callBack, pinSetting) {
  if (configs.dev.isMock) {
    queOfCallbacks.push({ callBack, pin });
  } else {
    rpio.poll(pin, callBack, pinSetting);
  }
}

/**
 * Fire off all the qued events
 */
function executeQue() {
  setInterval(() => {
    const callBackObject = queOfCallbacks[currentQuePosition];
    if (callBackObject) {
      if (configs.dev.isDebug) {
        console.log('==================');
        console.log(`Simulate button press on ${callBackObject.pin}.
          Execute cb: ${callBackObject.callBack.toString()}`);
        console.log('==================');
      }
      callBackObject.callBack();
      currentQuePosition++;
      if (currentQuePosition +1 > queOfCallbacks.length) {
        currentQuePosition = 0;
      }
    }
  }, configs.dev.mockDelay || 1000);
}

if (configs.dev.executeQue) {
  setTimeout(executeQue, 1000);
}

module.exports = { safePoll };
