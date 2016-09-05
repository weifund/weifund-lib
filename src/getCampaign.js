// utils
const emptyWeb3Address = require('./utils').emptyWeb3Address;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('weifund-contracts');

// get data methods
const getCampaignContractData = require('./getCampaignContractData');
const getCampaignInterfaceContractData = require('./getCampaignInterfaceContractData');
const getCampaignBeneficiaryData = require('./getCampaignBeneficiaryData');
const getCampaignIPFSData = require('./getCampaignIPFSData');
const parseCampaignDataObject = require('./parseCampaignDataObject');

// load campaign
const getCampaign = function (options, callback) {
  const campaignID = parseInt(options.campaignID, 10);
  const web3 = options.web3;
  const ipfs = options.ipfs;
  const network = options.network;

  // load campaign information from registry
  contracts.CampaignRegistry(web3, network).campaigns(campaignID, function (campaignRegistryError, campaignRegistryResult) {
    // handle campaign contract data error
    if (campaignRegistryError) {
      return callback(campaignRegistryError, null);
    }

    // campaign address
    const campaignAddress = campaignRegistryResult[0];

    // campaign address
    if (campaignAddress === emptyWeb3Address || campaignAddress === '0x') {
      return callback('Invalid campaign ID or address. No campaign is registered under that address..', null);
    }

    // get campaign contract data
    getCampaignContractData({ campaignAddress: campaignAddress, web3: web3, network: network }, function (campaignDataError, campaignDataResult) {
      // handle campaign contract data error
      if (campaignDataError) {
        return callback(campaignDataError, null);
      }

      // get campaign interface data
      getCampaignInterfaceContractData({ campaignInterfaceAddress: campaignDataResult.interface, web3: web3, network: network }, function (interfaceError, interfaceDataResult) {
        // handle campaign contract data error
        if (interfaceError) {
          return callback(interfaceError, null);
        }

        // get campaign beneficiary data
        getCampaignBeneficiaryData({ beneficiaryAddress: interfaceDataResult.beneficiary, web3: web3, network: network }, function (beneficiaryError, beneficiaryResult) {
          // handle campaign contract data error
          if (beneficiaryError) {
            return callback(beneficiaryError, null);
          }

          // get campaign ipfs data
          getCampaignIPFSData({ registeredCampaignData: campaignDataResult.registeredData, ipfs: ipfs, network: network }, function (ipfsError, ipfsResult) {
            // handle campaign contract data error
            if (ipfsError) {
              return callback(ipfsError, null);
            }

            // main campaign object
            const campaignDataObject = parseCampaignDataObject({
              web3: web3,
              network: network,
              combinedCampaignData: Object.assign({},
                campaignDataResult,
                interfaceDataResult,
                beneficiaryResult,
                ipfsResult),
            });

            // fire final callback
            callback(null, campaignDataObject);
          });
        });
      });
    });
  });
};

// export
module.exports = getCampaign;
