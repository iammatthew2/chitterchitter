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
const config = require('../util/config');

let twin = {};

const configureTwin = receivedTwin => twin = receivedTwin;

/**
 * Fire events based on device twin activity
 */
function handleDeviceTwinEvents() {
  twin.on('properties.desired.thing', thing => {
    console.log('Setting thing to thing');
    eventBus.emit('config.events.thing');
  });

  twin.on('properties.desired.something.nested', delta => {
    if (delta.onething || delta.otherthig) {
      console.log(
          `Configuring minimum temperature: ${
            twin.properties.desired.components.climate.minTemperature}`
      );
      console.log(
          `Configuring maximum temperture: ${
            twin.properties.desired.components.climate.maxTemperature}`
      );
      const reportedPropertiesPatch = {};
      reportedPropertiesPatch.minTemperature =
        twin.properties.desired.components.climate.minTemperature;
      reportedPropertiesPatch.maxTemperature =
        twin.properties.desired.components.climate.maxTemperature;
      sendReportedProperties();
    }
  });
}

/**
 * Upload device twin with new properties
 * @param {Object} reportedPropertiesPatch
 */
function sendReportedProperties(reportedPropertiesPatch) {
  twin.properties.reported.update(reportedPropertiesPatch, err => {
    if (err) {
      throw err;
    } else {
      console.log('Twin state reported');
    }
  });
}

/**
 * Upload file to iot hub associated storage
 * @param {String} filename
 * @return {Promise}
 */
function upload(filename) {
  const fileAndPath = `${config.uploadFilePath}${filename}`;
  return fsStatAsync(fileAndPath)
      .then(stats => {
        const rr = fs.createReadStream(fileAndPath);
        return clientUploadToBlobAsync(filename, rr, stats.size);
      })
      .then(() => console.log('File uploaded'))
      .catch(err => console.error(`[Error]: ${err}`));
}

/**
 *
 * @param {Array} - [source file name, local name to be applied]
 * @return {Promise}
 */
function download([source, localName]) {
  return fetch(source).then(res => {
    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(`${config.downloadFilePath}${localName}`);
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

module.exports = {
  connect() {
    client.open(function(err) {
      client.getTwin(function(err, receivedTwin) {
        configureTwin(receivedTwin);
        handleDeviceTwinEvents();
      });
    });
  },

  updateDeviceState: reportedPropertiesPatch => {
    twin.properties.reported.update(reportedPropertiesPatch, err => {
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
    sendFromDeviceId,
  }) => {
    const completeMessage = new Message(
        JSON.stringify({
          messageText,
          sendToDeviceId,
          sendFromDeviceId,
          audioFile,
        })
    );

    client.sendEvent(completeMessage, err => {
      if (err) {
        console.error(`send error: ${ err.toString()}`);
      } else {
        console.log('message sent');
      }
    });
  },

  batchUpload: async files => {
    const proms = [];
    for (let i = 0; i < files.length; i++) {
      proms.push(upload(files[i]));
      await new Promise(res => setTimeout(res, 500));
    }
    return Promise.all(proms);
  },

  /**
   *
   * @param {*} files - [['sourceName', 'localName'], ['sourceName', 'localName']]
   * @return {Promise}
   */
  batchDownload: files => Promise.all(files.map(download)),
};
