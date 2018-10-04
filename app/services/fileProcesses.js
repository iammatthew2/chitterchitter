const fs = require('fs');
const promisify = require('util').promisify;
const config = require('../util/config');
const fsUnlinkAsync = promisify(fs.unlink);
const fsStatAsync = promisify(fs.stat);

const doesFileExist = file => fsStatAsync(file);

/**
 * Delete an array of files from the device
 * @param {Array} files
 * @return {Promise}
 */
function deleteFiles(files) {
  if (files.length < 1) {
    throw new Error('deleteFiles() - no files provided');
  }
  let deleteFilesProms = [];
  files.map(filename => `${config.uploadFilePath}${filename}`)
      .forEach(file => {
        console.log(`deleting ${file}`);
        deleteFilesProms.push(fsUnlinkAsync(file));
      });
  return Promise.all(deleteFilesProms);
}

module.exports = { deleteFiles, doesFileExist };
