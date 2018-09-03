const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client
const chalk = require('chalk');
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;
const client = DeviceClient.fromConnectionString(connectionString, Mqtt);

function defaultAction(){
  console.log('iotHub connection not yet complete');
}

const iotHubActions = {
  update: defaultAction
}

const iotHub = {
  connect() {
    // Connect to the IoT hub.
    client.open(function (err) {
      client.getTwin(function(err, twin) {
        iotHubActions.twin = twin;
        iotHubActions.update = (obj) => {
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