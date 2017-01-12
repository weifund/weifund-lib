// bignumber and contracts
const BigNumber = require('bignumber.js');

// get additional campaign properties
const getCampaignContractData = function (options, callback) {
  var campaignObject = {
    id: null,
    addr: options.campaignAddress,
    interface: '0x',
    owner: '0x',
    campaignContractCode: '0x',
    balance: new BigNumber('0'),
    staffPick: false,
    registeredData: null,
  };

  const campaignAddress = options.campaignAddress;
  const web3 = options.web3;
  const contracts = options.contracts;

  // get campaign registry data
  contracts.CampaignRegistry.instance().abiOf(campaignAddress, function (interfaceError, interfaceAddress) {
    // handle owner error
    if (interfaceError) {
      return callback(interfaceError, null);
    }

    // get the campaign ID
    contracts.CampaignRegistry.instance().idOf(campaignAddress, function (idError, campaignId) {
      // handle owner error
      if (idError) {
        return callback(idError, null);
      }

      // id
      campaignObject.id = campaignId.toString(10);

      // get the campaign ID
      contracts.StandardCampaignFactory.instance().isService(campaignAddress, function (campaignFactoryServiceError, isStandardCampaignFactoryService) {
        // handle owner error
        if (campaignFactoryServiceError) {
          return callback(campaignFactoryServiceError, null);
        }

        // id
        campaignObject.fromStandardCampaignFactory = isStandardCampaignFactoryService;

        // get the campaign ID
        contracts.StandardCampaign.factory.at(campaignAddress).enhancer(function (enhancerError, enhancerResult) {
          // handle owner error
          if (enhancerError) {
            return callback(enhancerError, null);
          }

          // set enhancer
          campaignObject.enhancer = enhancerResult;

          // get the campaign ID
          contracts.Model1Enhancer.factory.at(enhancerResult).token(function (tokenError, tokenResult) {
            // handle owner error
            if (tokenError) {
              return callback(tokenError, null);
            }

            // set enhancer
            campaignObject.token = tokenResult;

            // handle interface address
            if (interfaceAddress === '0x') {
              campaignObject.interface = campaignAddress;
            } else {
              campaignObject.interface = interfaceAddress;
            }

            // get campaign owner
            contracts.Owned.factory.at(campaignAddress).owner(function (ownerError, ownerAddress) {
              // handle owner error
              if (ownerError) {
                return callback(ownerError, null);
              }

              // set owner property
              campaignObject.owner = ownerAddress;

              // get campaign balanace
              web3.eth.getBalance(campaignAddress, function (balanceError, balanceResult) {
                // handle owner error
                if (balanceError) {
                  return callback(balanceError, null);
                }

                // set balance properties
                campaignObject.balance = balanceResult;

                // staffPicks
                contracts.CurationRegistry.instance().serviceApprovedBy('', campaignAddress, function (staffPicksError, staffPickResult) {
                  // handle owner error
                  if (staffPicksError) {
                    return callback(staffPicksError, null);
                  }

                  // campaign object is staff pick
                  campaignObject.staffPick = staffPickResult;

                  // get contract code
                  web3.eth.getCode(campaignAddress, function (campaignContractCodeError, campaignContractCode) {
                    // handle owner error
                    if (campaignContractCodeError) {
                      return callback(campaignContractCodeError, null);
                    }

                    // handle campaign contract code error
                    // set campaign code
                    campaignObject.campaignContractCode = campaignContractCode;

                    // get ipfs data
                    contracts.CampaignDataRegistry.instance().storedData(campaignAddress, function (dataRegistryError, dataRegistryResult) {
                      // handle owner error
                      if (dataRegistryError) {
                        return callback(dataRegistryError, null);
                      }

                      // registered data property
                      campaignObject.registeredData = dataRegistryResult;

                      // fire callback
                      callback(null, campaignObject);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

module.exports = getCampaignContractData;
