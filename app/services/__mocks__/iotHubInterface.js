module.exports = {
  connect() {

  },

  // updateDeviceState: (reportedPropertiesPatch) => {
  //   twin.properties.reported.update(reportedPropertiesPatch, (err) => {
  //     if (err) {
  //       throw err;
  //     } else {
  //       console.log('Twin state reported');
  //     }
  //   });
  // },

  // sendMesssage: ({
  //   messageText,
  //   sendToDeviceId,
  //   audioFile,
  //   sendFromDeviceId
  // }) => {
  //   const completeMessage = new Message(
  //     JSON.stringify({
  //       messageText,
  //       sendToDeviceId,
  //       sendFromDeviceId,
  //       audioFile
  //     })
  //   );

  //   client.sendEvent(completeMessage, err => {
  //     if (err) {
  //       console.error('send error: ' + err.toString());
  //     } else {
  //       console.log('message sent');
  //     }
  //   });
  // },

  // upload: (files) => {
  //   let fileUploadPromises = [];

  //   files.forEach(file => {
  //     fileUploadPromises.push(
  //       fsStatAsync(file)
  //         .then(stats => {
  //           const rr = fs.createReadStream(file);
  //           return clientUploadToBlobAsync(file, rr, stats.size);
  //         })
  //         .then(() => console.log('File uploaded'))
  //         .catch(err => console.error(`[Error]: ${err}`))
  //     );
  //   });

  //   Promise.all(fileUploadPromises).then(() => {
  //     console.log('all files are up');
  //   });
  // },

  batchDownload: () => {
    return Promise.resolve();
  },
};
