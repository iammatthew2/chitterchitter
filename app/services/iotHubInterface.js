const path = require('path');
const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client
const chalk = require('chalk');
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;
const client = DeviceClient.fromConnectionString(connectionString, Mqtt);
const fs = require('fs');
const storage = require('azure-storage');

const sourceFilePath = path.resolve('abc123/out22.wav');
const blobService = storage.createBlobService();
const blobName = path.basename(sourceFilePath, path.extname(sourceFilePath));
const containerName = 'iot-hub-container';

function defaultAction(){
  console.log('iotHub connection not yet complete');
}

const iotHubActions = {
  updateDeviceState: defaultAction,
  sendFile: (filename) => fs.stat(filename, function (err, stats) {
    const rr = fs.createReadStream(filename);
    client.uploadToBlob(filename, rr, stats.size, function (err) {
        if (err) {
            console.error(chalk.red('Error uploading file: ' + err.toString()));
        } else {
            console.log(chalk.green('File uploaded'));
        }
    });
  }),
   list: () => {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Items in container '${containerName}':`, data: data });
            }
        });
    });
},

 createContainer: () => {
  return new Promise((resolve, reject) => {
      blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
          if (err) {
              reject(err);
          } else {
              resolve({ message: `Container '${containerName}' created` });
          }
      });
  });
},
download2: () => {
  console.log('https://chitterstorage2.blob.core.windows.net/iot-hub-container/abc123/out2.wav');
  var http = require('http');
  var fs = require('fs');
  
  var file = fs.createWriteStream("file.jpg");
  var request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
    response.pipe(file);
  });
},
  download: () => {   
    const dowloadFilePath = sourceFilePath.replace('abc123/out', 'narfed');
    return new Promise((resolve, reject) => {
        blobService.getBlobToLocalFile(containerName, blobName, dowloadFilePath, (err) => {
            if (err) {
              debugger;
                reject(err);
            } else {
              debugger;
                resolve({ message: `Download of '${blobName}' complete` });
            }
        });
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