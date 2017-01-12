// requires
const xss = require('xss');
const BigNumber = require('bignumber.js');
const base58 = require('bitcore/lib/encoding/base58.js');
const solidityToABI = require('solidity-to-abi');

// log abstraction
function log() {
  console.log.apply(console, arguments); // eslint-disable-line
}

// returns bool
function isNonEmptyByteCode(code) {
  return code !== '0x' && code !== '' && code !== false;
}

// to be build
function isMultiSigContract() {
  return false;
}

// is valid web3 address
function isValidWeb3Address(address, web3Instance) {
  return web3Instance.isAddress(address);
}

// is valid ipfs data
function isValidCampaignData(data) {
  return typeof data === 'object' && data !== null;
}

// is a valid campaign to be listed
function isValidCampaign(data) {
  if (data.hasName
    && data.hasValidBeneficiaryAddress
    && data.hasOwner
    && !isNaN(data.progress)) {
    return true;
  }

  return false;
}

// is valid ipfs data
function isValidIPFSHash() {
  return true;
}

// is standard campaign
function isStandardCampaign(code) { // eslint-disable-line
  return false; // String(code).includes(classes.StandardCampaign.bytecode);
}

// one day in unix seconds
const oneDay = 24 * 60 * 60 * 1000;

// just an empty addr
const emptyWeb3Address = '0x0000000000000000000000000000000000000000';

// provide etherscan link
function etherScanAddressUrl(address, selectedNetwork) {
  return `http://${`${selectedNetwork}.` || ''}etherscan.io/address/${address}`;
}

// provide etherscan link
function etherScanTxHashUrl(txHash, selectedNetwork) {
  return `http://${`${selectedNetwork}.` || ''}etherscan.io/tx/${txHash}`;
}

// parse raw campaign data into an object
function parseCampaignRegistryData(campaignID, rawCampaignData) {
  const dataObject = {
    id: parseInt(campaignID, 10),
    addr: rawCampaignData[0],
    interface: rawCampaignData[1],
    registered: rawCampaignData[2].toNumber(10),
  };

  // make interface address if non provided
  if (dataObject.interface === emptyWeb3Address) {
    dataObject.interface = dataObject.addr;
  }

  // return new data object
  return dataObject;
}

// build inputs or outputs array from raw inputs string
function buildInputsArray(rawInputsString) {
  var returnArray = [];
  const rawMethodInputs = rawInputsString.split(',');

  // no inputs
  if (typeof rawMethodInputs === 'undefined' || rawMethodInputs.length === 0) {
    return [];
  }

  rawMethodInputs.forEach(function (rawMethodInput) {
    const inputData = rawMethodInput.split(' ');
    const type = inputData[0];
    const name = inputData[1] || '';

    // if type exists
    if (type !== '' && typeof type !== 'undefined') {
      returnArray.push({
        type: type,
        name: name,
      });
    }
  });

  return returnArray;
}

// cap first letter of words of words in string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// convert programatical name to pretty name
function parseSolidityMethodName(rawName) {
  // break into parts
  var parseNamePieces = rawName.split(/(?=[A-Z])/);

  // cap first letter
  parseNamePieces = parseNamePieces.map(function (namePieceItem) {
    return capitalizeFirstLetter(namePieceItem);
  });

  // rejoin name with space
  return parseNamePieces.join(' ');
}

// is bignumber
function isBigNumber(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (typeof obj.__proto__.dividedToIntegerBy !== 'undefined') { // eslint-disable-line
      return true;
    }
  }

  return false;
}

// parse a solidity method interface
function parseSolidityMethodInterface(methodInterface) {
  return solidityToABI(methodInterface);
}

// This function handles arrays and objects
function filterXSSObject(obj) {
  // setup new object
  var newObject = {};

  // if object is a string, handle it
  if (typeof obj === 'string') {
    return xss(obj);
  }

  // if object is an array
  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return filterXSSObject(item);
    });
  }

  // if is big number, parse string, then re-create bignumber
  if (typeof obj === 'object' && obj !== null) {
    const objProto = Object.getPrototypeOf(obj);

    // if obj has bignumber properties
    if (objProto.hasOwnProperty('toString')
      && objProto.hasOwnProperty('dividedBy')
      && objProto.hasOwnProperty('toNumber')) {
      return new BigNumber(xss(obj.toString(10)));
    }
  }

  // for loop through object
  if (typeof obj === 'object' && obj !== null) {
    for (var k in obj) { // eslint-disable-line
      if ({}.hasOwnProperty.call(obj, k)) {
        newObject[xss(k)] = filterXSSObject(obj[k]);
      }
    }

    return newObject;
  }

  // return object
  return obj;
}

// base 58 functions for IPFS hashes
function base58ToHex(b58) {
  var hexBuf = base58.decode(b58);
  return hexBuf.toString('hex');
}

// base58 functions for IPFS
function hexToBase58(hexStr) {
  var buf = new Buffer(hexStr, 'hex');
  return base58.encode(buf);
}

module.exports = {
  log: log,
  isBigNumber: isBigNumber,
  etherScanAddressUrl: etherScanAddressUrl,
  etherScanTxHashUrl: etherScanTxHashUrl,
  parseCampaignRegistryData: parseCampaignRegistryData,
  buildInputsArray: buildInputsArray,
  oneDay: oneDay,
  parseSolidityMethodInterface: parseSolidityMethodInterface,
  emptyWeb3Address: emptyWeb3Address,
  capitalizeFirstLetter: capitalizeFirstLetter,
  filterXSSObject: filterXSSObject,
  parseSolidityMethodName: parseSolidityMethodName,
  isValidIPFSHash: isValidIPFSHash,
  isStandardCampaign: isStandardCampaign,
  isValidCampaign: isValidCampaign,
  isValidWeb3Address: isValidWeb3Address,
  isMultiSigContract: isMultiSigContract,
  isNonEmptyByteCode: isNonEmptyByteCode,
  isValidCampaignData: isValidCampaignData,
  base58ToHex: base58ToHex,
  hexToBase58: hexToBase58,
};
