// utils
const utils = require('./utils');
const filterXSSObject = utils.filterXSSObject;
const hexToBase58 = utils.hexToBase58;

// load campaign ipfs data
const getCampaignIPFSData = function (options, callback) {
  // registered campaign data
  const registeredCampaignData = options.registeredCampaignData;
  const ipfs = options.ipfs;

  // setup defailt campaign data object
  const campaignDataObject = {
    ipfsHash: '',
    data: null,
  };

  // has ipfs hash bytecode
  const dataBytecode = registeredCampaignData;
  const ipfsHash = hexToBase58(dataBytecode.slice(2));

  // set ipfs hash data property
  campaignDataObject.ipfsHash = ipfsHash;

  // if no ipfs data
  if (dataBytecode === '0x' || ipfsHash === '') {
    return callback(null, campaignDataObject);
  }

  // get data from IPFS
  ipfs.catJson(ipfsHash, function (catJsonError, catJsonResult) {
    // handle ipfs data
    if (catJsonError) {
      return callback(catJsonError, null);
    }

    // set IPFS data
    campaignDataObject.data = filterXSSObject(catJsonResult);

    // return data callback
    callback(null, campaignDataObject);
  });
};

// export get campaign ipfs data
module.exports = getCampaignIPFSData;
