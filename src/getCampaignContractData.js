// bignumber and contracts
const BigNumber = require('bignumber.js');
const contracts = require('weifund-contracts');

// get additional campaign properties
const getCampaignContractData = function (options, callback) {
  var campaignObject = {
    id: null,
    addr: campaignAddress,
    interface: '0x',
    owner: '0x',
    campaignContractCode: '0x',
    balance: new BigNumber('0'),
    staffPick: false,
    registeredData: null,
  };

  const campaignAddress = options.campaignAddress;
  const web3 = options.web3;
  const network = options.network;

  // get campaign registry data
  contracts.CampaignRegistry(web3, network).interfaceOf(campaignAddress, function (interfaceError, interfaceAddress) {
    // handle owner error
    if (interfaceError) {
      return callback(interfaceError, null);
    }

    // get the campaign ID
    contracts.CampaignRegistry(web3, network).idOf(campaignAddress, function (idError, campaignId) {
      // handle owner error
      if (idError) {
        return callback(idError, null);
      }

      // id
      campaignObject.id = campaignId.toString(10);

      // handle interface address
      if (interfaceAddress === '0x') {
        campaignObject.interface = campaignAddress;
      } else {
        campaignObject.interface = interfaceAddress;
      }

      // get campaign owner
      contracts.factories.Owned(web3).at(campaignAddress).owner(function (ownerError, ownerAddress) {
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
          contracts.StaffPicks(web3, network).activePicks(campaignAddress, function (staffPicksError, staffPickResult) {
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
              contracts.CampaignDataRegistry(web3, network).storedData(campaignAddress, function (dataRegistryError, dataRegistryResult) {
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
};

module.exports = getCampaignContractData;
