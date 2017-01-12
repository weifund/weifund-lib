// validators
const validUrl = require('valid-url');
const url = require('url');
const videoUrlInspector = require('video-url-inspector');
const BigNumber = require('bignumber.js');

// utils
const utils = require('./utils');
const emptyWeb3Address = utils.emptyWeb3Address;
const parseSolidityMethodInterface = utils.parseSolidityMethodInterface; // eslint-disable-line

// utils verifiers
const isNonEmptyByteCode = utils.isNonEmptyByteCode; // eslint-disable-line
const isMultiSigContract = utils.isMultiSigContract; // eslint-disable-line
const isValidWeb3Address = utils.isValidWeb3Address; // eslint-disable-line
const isValidCampaignData = utils.isValidCampaignData; // eslint-disable-line
const isValidCampaign = utils.isValidCampaign; // eslint-disable-line
const isValidIPFSHash = utils.isValidIPFSHash; // eslint-disable-line
const isStandardCampaign = utils.isStandardCampaign; // eslint-disable-line

// parse campaign abi properties
const parseCampaignDataObject = function (options) {
  const combinedCampaignData = options.combinedCampaignData; // eslint-disable-line
  const web3 = options.web3; // eslint-disable-line

  // campaign data object
  const campaignDataObject = Object.assign({}, {
    active: false,
    hasName: false,
    hasFailed: false,
    hasExpired: false,
    hasSucceeded: false,
    valid: false,
    hasPaidOut: false,
    hasIPFSHash: false,
    hasData: false,
    hasOwner: false,
    hasStage: true,
    hasFundingGoal: true,
    hasFundingCap: true,
    hasAmountRaised: false,
    blockNumber: options.blockNumber,

    hasEnhancer: false,
    enhancer: '0x',
    fromStandardCampaignFactory: false,
    fromModel1EnhancerFactory: false,

    hasToken: false,
    token: '0x',

    approximateSecondsToGo: 0,
    approximateDaysToGo: 0,
    approximateExpiryTimestamp: 0,
    approximateExpiryDate: 0,

    hasValidContributeMethodABI: false,
    hasValidPayoutMethodABI: false,
    hasValidRefundMethodABI: false,

    hasMailChimp: false,

    hasMainEntity: false,
    mainEntityType: false,
    mainEntityIsValidUrl: false,
    mainEntityUrl: {},
    mainEntityIsVideo: false,
    mainEntityVideo: null,

    hasImage: false,
    hasValidImage: false,
    imageUrl: `https://unsplash.it/450/450?image=${combinedCampaignData.id || 0}`,

    interfaceIsCampaignAddress: false,
    hasValidIPFSHash: isValidIPFSHash(combinedCampaignData.ipfsHash),
    hasValidData: isValidCampaignData(combinedCampaignData.data),
    beneficiaryIsMultiSig: isMultiSigContract(combinedCampaignData.beneficiaryContractCode),
    beneficiaryIsContract: isNonEmptyByteCode(combinedCampaignData.beneficiaryContractCode),
    hasValidInterfaceAddress: isValidWeb3Address(combinedCampaignData.interface, web3),
    contributeMethodABIObject: {'constant': false,'inputs': [{'name': '_amounts','type': 'uint256[]'}],'name': 'contributeMsgValue','outputs': [{'name': 'contributionID','type': 'uint256'}],'payable': true,'type': 'function'},  // eslint-disable-line
    payoutMethodABIObject: {'constant': false,'inputs': [],'name': 'payoutToBeneficiary','outputs': [],'payable': false,'type': 'function'}, // eslint-disable-line
    refundMethodABIObject: {'constant': false,'inputs': [{'name': '_contributionID','type': 'uint256'}],'name': 'claimRefundOwed','outputs': [{'name': 'balanceClaim','type': 'address'}],'payable': false,'type': 'function'}, // eslint-disable-line
    hasValidBeneficiaryAddress: isValidWeb3Address(combinedCampaignData.beneficiary, web3),
    hasValidAddress: isValidWeb3Address(combinedCampaignData.addr, web3),
    hasValidOwnerAddress: isValidWeb3Address(combinedCampaignData.owner, web3),
    campaignIsContract: isNonEmptyByteCode(combinedCampaignData.campaignContractCode),
    campaignIsStandard: isStandardCampaign(combinedCampaignData.campaignContractCode),
    loadTime: Math.round((new Date()).getTime() / 1000),
    progress: Math.round(combinedCampaignData.amountRaised.dividedBy(combinedCampaignData.fundingGoal) * 100),
    abi: [],
  }, combinedCampaignData);

  // has the campaign a name
  if (campaignDataObject.name !== '') {
    campaignDataObject.hasName = true;
  }

  if (typeof campaignDataObject.token === 'string'
    && campaignDataObject.token !== '0x'
    && campaignDataObject.token !== emptyWeb3Address) {
    campaignDataObject.hasToken = true;
  }

  if (typeof campaignDataObject.enhancer === 'string'
    && campaignDataObject.token !== '0x'
    && campaignDataObject.enhancer !== emptyWeb3Address) {
    campaignDataObject.hasEnhancer = true;
  }

  // ipfs hash bools
  if (campaignDataObject.ipfsHash !== ''
    && typeof campaignDataObject.ipfsHash !== 'undefined') {
    campaignDataObject.hasIPFSHash = true;
  }

  // valid data
  if (typeof campaignDataObject.data !== 'undefined' && campaignDataObject.data !== {}) {
    campaignDataObject.hasData = true;
  }

  const secondsDiff = campaignDataObject.expiry.minus(campaignDataObject.blockNumber).times(17).round(0);

  if (secondsDiff.greaterThanOrEqualTo(0)) {
    campaignDataObject.approximateSecondsToGo = secondsDiff;
  }

  campaignDataObject.approximateDaysToGo = secondsDiff.dividedBy(new BigNumber('86400')).round(0);
  campaignDataObject.approximateExpiryTimestamp = secondsDiff.add(new BigNumber((new Date()).getTime() / 1000)).round(0);
  campaignDataObject.approximateExpiryDate = new Date(campaignDataObject.approximateExpiryTimestamp.toNumber(10) * 1000);

  // interface information
  if (campaignDataObject.interface === campaignDataObject.addr) {
    campaignDataObject.interfaceIsCampaignAddress = true;
  }

  // ownership validation
  campaignDataObject.hasOwner = (campaignDataObject.owner !== '0x' && campaignDataObject.hasValidOwnerAddress);

  // abi objects as abi
  if (Object(campaignDataObject.refundMethodABIObject).hasOwnProperty('name')) {
    campaignDataObject.abi.push(campaignDataObject.refundMethodABIObject);
  }
  if (Object(campaignDataObject.payoutMethodABIObject).hasOwnProperty('name')) {
    campaignDataObject.abi.push(campaignDataObject.payoutMethodABIObject);
  }
  if (Object(campaignDataObject.contributeMethodABIObject).hasOwnProperty('name')) {
    campaignDataObject.abi.push(campaignDataObject.contributeMethodABIObject);
  }

  // check expiry
  if (campaignDataObject.blockNumber.greaterThanOrEqualTo(campaignDataObject.expiry)) {
    campaignDataObject.hasExpired = true;
  }

  // has the campaign failed
  if (campaignDataObject.stage.toString('10') === '1') {
    campaignDataObject.hasFailed = true;
  }

  // has the campaign succeeded
  if (campaignDataObject.stage.toString('10') === '2') {
    campaignDataObject.hasSucceeded = true;
  }

  // has funding goal
  if (campaignDataObject.fundingGoal.greaterThan(0)) {
    campaignDataObject.hasFundingCap = true;
  }

  // has funding goal
  if (campaignDataObject.fundingCap.greaterThan(0)) {
    campaignDataObject.hasFundingCap = true;
  }

  // has been paid out
  if (campaignDataObject.hasSucceeded && campaignDataObject.balance.lessThan(campaignDataObject.amountRaised)) {
    campaignDataObject.hasPaidOut = true;
  }

  // is the campaign active
  if (campaignDataObject.hasPaidOut === false && campaignDataObject.hasExpired === false) {
    campaignDataObject.active = true;
  }

  // has mailchimp data
  if (campaignDataObject.hasValidData) {
    if (campaignDataObject.data.hasOwnProperty('mailChimp')) {
      campaignDataObject.hasMailChimp = true;
    }
  }

  // parse campaign data
  if (campaignDataObject.hasValidData
    && campaignDataObject.data.hasOwnProperty('image')) {
    // data has image
    campaignDataObject.hasImage = true;

    // is valid image
    campaignDataObject.hasValidImage = validUrl.isUri(campaignDataObject.data.image) && true || false;

    // image url
    if (campaignDataObject.hasValidImage) {
      campaignDataObject.imageUrl = campaignDataObject.data.image;
    }
  }

  // parse campaign data
  if (campaignDataObject.hasValidData
    && campaignDataObject.data.hasOwnProperty('mainEntity')) {
    if (campaignDataObject.data.mainEntity !== '') {
      campaignDataObject.hasMainEntity = true;

      // string
      if (typeof campaignDataObject.data.mainEntity === 'object') {
        campaignDataObject.mainEntityType = 'object';
      }

      // string
      if (typeof campaignDataObject.data.mainEntity === 'string') {
        campaignDataObject.mainEntityType = 'string';
      }

      // main entity is url
      campaignDataObject.mainEntityIsValidUrl = validUrl.isUri(campaignDataObject.data.mainEntity) && true || false;

      // main entity url Parsed
      if (campaignDataObject.mainEntityIsValidUrl) {
        campaignDataObject.mainEntityUrl = url.parse(campaignDataObject.data.mainEntity);

        // parse any video main entity
        campaignDataObject.mainEntityVideo = videoUrlInspector(campaignDataObject.data.mainEntity);

        // main entity is a video
        if (campaignDataObject.mainEntityVideo !== null) {
          campaignDataObject.mainEntityIsVideo = true;
        }
      }
    }
  }

  // campaign is valid
  campaignDataObject.valid = isValidCampaign(campaignDataObject);

  // return new data object
  return campaignDataObject;
};

module.exports = parseCampaignDataObject;
