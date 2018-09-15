const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const Message = require('azure-iot-device').Message;
const DeviceClient = require('azure-iot-device').Client
const chalk = require('chalk');
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;
const client = DeviceClient.fromConnectionString(connectionString, Mqtt);
const fs = require('fs');

function defaultAction(){
  console.log('iotHub connection not yet complete');
}

function uploadCb(error){
  if (error) {
      console.error('Error uploading file: ' + err.toString());
  } else {
      console.log('File uploaded');
  }
}

const iotHubActions = {
  updateDeviceState: defaultAction,
  sendMesssage: ({messageText, sendToDeviceId, audioFile, sendFromDeviceId}) => {
    const completeMessage = new Message(JSON.stringify({
      messageText,
      sendToDeviceId,
      sendFromDeviceId,
      audioFile
    }));
  
    client.sendEvent(completeMessage, (err) => {
      if (err) {
        console.error('send error: ' + err.toString());
      } else {
        console.log('message sent');
      }
    })
  },

  upload: (files) => {
    files.forEach((file) => {
      fs.stat(file, (err, stats) => {
        const rr = fs.createReadStream(file);
        client.uploadToBlob(file, rr, stats.size, () => uploadCb(err));
      })
    });
  },

  download: () => {
    const https = require('https');
    const fs = require('fs');
    
    const file = fs.createWriteStream('latestDownload.wav');
    https.get('https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav', (response) => {
      console.log(chalk.magenta('file downloaded'));
      response.pipe(file);
    });
  }
}

const iotHub = {
  connect() {
    // Connect to the IoT hub.
    client.open(function (err) {  
      client.getTwin(function(err, twin) {
        iotHubActions.twin = twin;
        iotHubActions.updateDeviceState = (obj) => {
          twin.properties.reported.update(obj, (err) => {
            if (err) {
              console.error(chalk.red('Could not update twin'));
            } else {
              console.log(chalk.green('Twin: Sent reported properties'));
            }
          });
        }
      });
    });
  },

  iotHubActions
}


module.exports = iotHub;