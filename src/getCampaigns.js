// require web3
const Web3 = require('web3');

// require ipfs from vendor
const ipfs = require('ipfs-js');

// get campaign
const getCampaign = require('./getCampaign');

// check options
const checkOptions = function (options) {
  if (typeof options !== 'object') {
    throw new Error('getCampaigns options, must be an object {}');
  }

  if (typeof options.network !== 'string') {
    throw new Error('getCampaigns network property must be a string');
  }

  if (typeof options.ipfsProvider !== 'object') {
    throw new Error('getCampaigns ipfsProvider must be a specified object');
  }

  if (typeof options.web3Provider !== 'object') {
    throw new Error('getCampaigns web3Provider must be a specified object');
  }

  if (!Array.isArray(options.selector)) {
    throw new Error('getCampaigns selector must be an array');
  }

  if (options.selector.length <= 0) {
    throw new Error('getCampaigns selector array must have a length greater than zero');
  }
};

var ipfsAPI = {};
if (typeof window === 'undefined') {
  ipfsAPI = require('ipfs-api'); // eslint-disable-line
}

// load campaigns
// returns object with campaign data by ID
const getCampaigns = function (options, callback) {
  // assembled return object
  var assembledCampaignObject = {};
  var attemptedCampaignsLoaded = 0;

  // check options
  checkOptions(options);

  // new web3 object
  const web3 = new Web3();

  // const selector = options.selector;
  const network = options.network;
  const ipfsProvider = options.ipfsProvider;
  const web3Provider = options.web3Provider;
  const selector = options.selector;
  const expectedCampaignsLoaded = selector.length;

  // set ipfs provider
  if (typeof window === 'undefined') {
    ipfs.setProvider(ipfsAPI(ipfsProvider));
  } else {
    ipfs.setProvider(ipfsProvider);
  }

  // set web3 provider
  web3.setProvider(web3Provider);

  // selector
  selector.forEach(function (campaignID) {
    // get campaign
    getCampaign({ web3: web3, ipfs: ipfs, campaignID: campaignID, network: network }, function (getCampaignError, getCampaignResult) {
      // add attempt
      attemptedCampaignsLoaded += 1;

      // handle error
      if (!getCampaignError) {
        assembledCampaignObject[getCampaignResult.id] = getCampaignResult;
      }

      // if all campaigns selected where attempted loaded
      if (attemptedCampaignsLoaded === expectedCampaignsLoaded) {
        // loaded campaigns
        callback(null, assembledCampaignObject);
      }
    });
  });
};

// export get campaigns method
module.exports = getCampaigns;
