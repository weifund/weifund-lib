// require web3
const Web3 = require('web3');
const IPFS = require('ipfs-mini');

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

  if (!Array.isArray(options.selector)) {
    throw new Error('getCampaigns selector must be an array');
  }

  if (options.selector.length <= 0) {
    throw new Error('getCampaigns selector array must have a length greater than zero');
  }
};

// load campaigns
// returns object with campaign data by ID
const getCampaigns = function (options, callback) {
  // assembled return object
  var assembledCampaignObject = {};
  var attemptedCampaignsLoaded = 0;

  // check options
  checkOptions(options);

  // const selector = options.selector;
  const network = options.network;
  const ipfsProvider = options.ipfsProvider || { host: 'ipfs.infura.io', port: 5001, protocol: 'https' };
  const web3Provider = options.web3Provider || new Web3.providers.HttpProvider('https://ropsten.infura.io/');
  const selector = options.selector;
  const expectedCampaignsLoaded = selector.length;

  // new web3 object
  const web3 = new Web3(web3Provider);

  // set ipfs var
  const ipfs = new IPFS(ipfsProvider);

  // selector
  selector.forEach(function (campaignID) {
    // get campaign
    getCampaign({ web3, ipfs, campaignID, network }, function (getCampaignError, getCampaignResult) {
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
