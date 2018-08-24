const rpio = require('rpio');
const configs = require.main.require('./constants/config');

const queOfCallbacks = [];
let currentQuePosition = 0;

function safePoll(pin, callBack, pinSetting) {
  if (configs.isMock) {
    queOfCallbacks.push({callBack, pin});
  } else {
    rpio.poll(pin, callBack, pinSetting)
  }
}

function executeQue(){
  setInterval(() => {
    const callBackObject = queOfCallbacks[currentQuePosition];
    if(callBackObject) {
      console.log(`Simulate button press on ${callBackObject.pin}. Execute cb: ${callBackObject.callBack.toString()}`);
      callBackObject.callBack();
      currentQuePosition++;
      if (currentQuePosition +1 > queOfCallbacks.length) {
        currentQuePosition = 0;
      }
    }
  }, configs.mockDelay || 1000);
}

if (configs.isMock) {
  setTimeout(executeQue, 1000);
}

module.exports = { safePoll };