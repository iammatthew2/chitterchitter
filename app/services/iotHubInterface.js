const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const Message = require('azure-iot-device').Message;
const DeviceClient = require('azure-iot-device').Client
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;
const client = DeviceClient.fromConnectionString(connectionString, Mqtt);
const fs = require('fs');
const promisify = require('util').promisify;
const fsStatAsync = promisify(fs.stat);
const clientUploadToBlobAsync = promisify(client.uploadToBlob.bind(client));

function defaultAction(){
  console.log('iotHub connection not yet complete');
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
    let fileUploadPromises = [];

    files.forEach((file) => {
      fileUploadPromises.push(
      fsStatAsync(file)
      .then((stats) => {
        const rr = fs.createReadStream(file);
        return clientUploadToBlobAsync(file, rr, stats.size);
      })
      .then(() =>console.log('File uploaded'))
      .catch(err => console.error(`[Error]: ${err}`))
      )
    });

    Promise.all(fileUploadPromises).then(() => {
      console.log('all files are up');
    });
  },

  download: () => {
    const https = require('https');
    const fs = require('fs');
    
    const file = fs.createWriteStream('latestDownload.wav');
    https.get('https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav', (response) => {
      console.log('file downloaded');
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
              console.error('Could not update twin');
            } else {
              console.log('Twin: Sent reported properties');
            }
          });
        }
      });
    });
  },

  iotHubActions
}


module.exports = iotHub;