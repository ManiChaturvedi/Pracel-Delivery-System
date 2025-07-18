const xml2js = require('xml2js');

function parseXmlBuffer(buffer) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(buffer, { explicitArray: false }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = { parseXmlBuffer }; 