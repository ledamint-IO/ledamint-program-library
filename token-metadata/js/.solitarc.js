// @ts-check
const path = require('path');
const programDir = path.join(__dirname, '..', 'program');
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'src', 'generated');
const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
  idlGenerator: 'shank',
  programName: 'lpl_token_metadata',
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
  serializers: {
    Metadata: './src/custom/metadata-deserializer.ts',
    TokenRecord: './src/custom/token-record-deserializer.ts',
  },
};
