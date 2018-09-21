const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const Message = require('azure-iot-device').Message;
const DeviceClient = require('azure-iot-device').Client;
const eventBus = require('../util/eventBus');
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;
const client = DeviceClient.fromConnectionString(connectionString, Mqtt);
const fs = require('fs');
const promisify = require('util').promisify;
const fsStatAsync = promisify(fs.stat);
const clientUploadToBlobAsync = promisify(client.uploadToBlob.bind(client));
const fetch = require('node-fetch');

let twin = {};

function configureTwin(receivedTwin) {
  twin = receivedTwin;
}

function handleDeviceTwinEvents() {
  twin.on('properties.desired.thing', thing => {
    console.log('Setting thing to thing');
    eventBus.emit(config.events.thing);
  });

  twin.on('properties.desired.something.nested', delta => {
    if (delta.onething || delta.otherthig) {
      console.log(
        'Configuring minimum temperature: ' +
          twin.properties.desired.components.climate.minTemperature
      );
      console.log(
        'Configuring maximum temperture: ' +
          twin.properties.desired.components.climate.maxTemperature
      );

      reportedPropertiesPatch.minTemperature =
        twin.properties.desired.components.climate.minTemperature;
      reportedPropertiesPatch.maxTemperature =
        twin.properties.desired.components.climate.maxTemperature;
      sendReportedProperties();
    }
  });
}

function sendReportedProperties(reportedPropertiesPatch) {
  twin.properties.reported.update(reportedPropertiesPatch, (err) => {
    if (err) {
      throw err;
    } else {
      console.log('Twin state reported');
    }    
  });
}

module.exports = {
  connect() {
    client.open(function(err) {
      client.getTwin(function(err, receivedTwin) {
        configureTwin(receivedTwin);
        handleDeviceTwinEvents();
      });
    });
  },

  updateDeviceState: (reportedPropertiesPatch) => {
    twin.properties.reported.update(reportedPropertiesPatch, (err) => {
      if (err) {
        throw err;
      } else {
        console.log('Twin state reported');
      }    
    });
  },

  sendMesssage: ({
    messageText,
    sendToDeviceId,
    audioFile,
    sendFromDeviceId
  }) => {
    const completeMessage = new Message(
      JSON.stringify({
        messageText,
        sendToDeviceId,
        sendFromDeviceId,
        audioFile
      })
    );

    client.sendEvent(completeMessage, err => {
      if (err) {
        console.error('send error: ' + err.toString());
      } else {
        console.log('message sent');
      }
    });
  },

  upload: (files) => {
    let fileUploadPromises = [];

    files.forEach(file => {
      fileUploadPromises.push(
        fsStatAsync(file)
          .then(stats => {
            const rr = fs.createReadStream(file);
            return clientUploadToBlobAsync(file, rr, stats.size);
          })
          .then(() => console.log('File uploaded'))
          .catch(err => console.error(`[Error]: ${err}`))
      );
    });

    Promise.all(fileUploadPromises).then(() => {
      console.log('all files are up');
    });
  },

  download: (fileName) => {
    return fetch(`https://chitterstorage2.blob.core.windows.net/iot-hub-container/${fileName}`)
    .then(res => {
      return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream('testDownload.wav');
        res.body.pipe(dest);
        res.body.on('error', err => {
          reject(err);
        });
        dest.on('finish', () => {
          console.log('file was downloaded');
          return resolve();
        });
        dest.on('error', err => {
          reject(err);
        });
      });
    });
  }
};
