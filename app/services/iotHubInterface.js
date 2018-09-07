const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client
const chalk = require('chalk');
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;
const client = DeviceClient.fromConnectionString(connectionString, Mqtt);
const fs = require('fs');

function defaultAction(){
  console.log('iotHub connection not yet complete');
}

const iotHubActions = {
  updateDeviceState: defaultAction,

  upload: (filename) => fs.stat(filename, function (err, stats) {
    const rr = fs.createReadStream(filename);
    client.uploadToBlob(filename, rr, stats.size, function (err) {
        if (err) {
            console.error(chalk.red('Error uploading file: ' + err.toString()));
        } else {
            console.log(chalk.green('File uploaded'));
        }
    });
  }),

  download: () => {
    console.log('https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav');
    const https = require('https');
    const fs = require('fs');
    
    const file = fs.createWriteStream('latestDownload.wav');
    const request = https.get('https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav', function(response) {
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