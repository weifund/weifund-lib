// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('./contracts');
const campaign = contracts.campaignContractFactory;

// campaign interface properties
const campaignInterfaceProperties = [
  'amountRaised',
  'beneficiary',
  'contributeMethodABI',
  'expiry',
  'fundingGoal',
  'name',
  'payoutMethodABI',
  'refundMethodABI',
  'version',
];

// helper callback, get all basic campaign interface properties
const getCampaignInterfaceContractData = function (campaignInterfaceAddress, callback, propertyToLoadInput, campaignObjectInput) {
  var propertyToLoad = propertyToLoadInput;
  var campaignObject = campaignObjectInput;

  // campaign object
  if (typeof campaignObject === 'undefined') {
    campaignObject = {};
  }

  // property to load
  if (typeof propertyToLoad === 'undefined') {
    propertyToLoad = campaignInterfaceProperties[0];
  }

  // setup interface instance
  const interfaceInstance = campaign.at(campaignInterfaceAddress);

  // property index
  const propertyIndex = campaignInterfaceProperties.indexOf(propertyToLoad);

  // load property
  interfaceInstance[propertyToLoad](function (propertyError, propertyResult) {
    // handle property load error
    if (propertyError) {
      return callback(propertyError, null);
    }

    // property
    campaignObject[propertyToLoad] = propertyResult;

    // if all properties loaded
    if (propertyIndex === campaignInterfaceProperties.length - 1) {
      callback(null, campaignObject);
    } else {
      getCampaignInterfaceContractData(campaignInterfaceAddress,
        callback,
        campaignInterfaceProperties[propertyIndex + 1],
        campaignObject);
    }
  });
};

module.exports = getCampaignInterfaceContractData;
