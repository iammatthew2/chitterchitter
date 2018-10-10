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

const events = config.events;

let twin = {};

const configureTwin = receivedTwin => twin = receivedTwin;

/**
 * Get the last reported data to reconfigure temporal state
 * {Object} reportedData
 */


/**
 * Fire events based on device twin activity
 */
function handleDeviceTwinEvents() {
  twin.on('properties.desired', delta => {
    console.log(`desired properties: ${JSON.stringify(delta)}`);
    eventBus.emit(events.RECEIVED_CLOUD_STATE_PATCH, delta);
  });
}

/**
 * Upload device twin with new properties
 * @param {Object} reportedPropertiesPatch
 */
function sendReportedProperties(reportedPropertiesPatch) {
  // TODO: promisify reported.update()
  twin.properties.reported.update(reportedPropertiesPatch, err => {
    if (err) {
      throw err;
    } else {
      console.info(`Twin state update success - patch: ${JSON.stringify(reportedPropertiesPatch)}`);
    }
  });
}

/**
 * Upload file to iot hub associated storage
 * @param {String} filename
 * @param {String} newName - optional - name to use if renaming the file on upload
 * @return {Promise}
 */
function upload(filename, newName) {
  const fileAndPath = `${config.uploadFilePath}${filename}`;
  return fsStatAsync(fileAndPath)
      .then(stats => {
        const nameOfUploadedFile = newName ? newName : filename;
        const rr = fs.createReadStream(fileAndPath);
        console.log(`upload file: ${filename} as ${nameOfUploadedFile}`);

        return clientUploadToBlobAsync(nameOfUploadedFile, rr, stats.size);
      })
      .then(() => Promise.resolve(filename))
      .catch(err => console.error(`[Error]: ${err}`));
}

/**
 *
 * @param {Array} - [source file name, local name to be applied]
 * @return {Promise}
 */
function download([source, localName]) {
  return fetch(decodeURIComponent(source)).then(res => {
    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(`${config.downloadFilePath}${localName}`);
      res.body.pipe(dest);
      res.body.on('error', err => {
        reject(err);
      });
      dest.on('finish', () => resolve());
      dest.on('error', err => reject(err));
    });
  });
}

module.exports = {
  connect() {
    client.open(function(err) {
      client.getTwin(function(err, receivedTwin) {
        configureTwin(receivedTwin);
        handleDeviceTwinEvents();
        eventBus.emit(events.RECEIVED_CLOUD_STATE, receivedTwin.properties.desired);
      });
    });
  },

  // prob not needed for final product
  updateDeviceState: sendReportedProperties,

  /**
   * @param {Object} messageBody
   */
  sendMesssage: messageBody => {
    const completeMessage = new Message(JSON.stringify(messageBody));

    client.sendEvent(completeMessage, err => {
      if (err) {
        console.error(`send error: ${ err.toString()}`);
      } else {
        console.log('message sent');
      }
    });
  },

  /**
   * @param {Array} files - [{filename, newName}, {filename, newName}, ...]
   */
  batchUpload: async files => {
    const proms = [];
    if (files.length < 1) {
      throw new Error('iotHubInterface.batchUpload - no files to upload');
    }

    for (let i = 0; i < files.length; i++) {
      proms.push(upload(files[i]['slot'], files[i]['newName']));
      // add pause in this loop to throttle our uploads
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
