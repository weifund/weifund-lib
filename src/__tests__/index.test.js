const assert = require('chai').assert;
const Web3 = require('web3');
const web3 = new Web3();

// get campaigns method
const getCampaigns = require('../index').getCampaigns;

// utils
const utils = require('../utils');
const isValidWeb3Address = utils.isValidWeb3Address;

describe('getCampaigns', () => {
  it('should load campaigns from mainnet', (done) => {
    // get campaigns
    getCampaigns({
      // set network
      // or 'testnet'
      network: 'mainnet',

      // set campaign selector
      // array (i.e. array of campaignIDs)
      selector: [0, 1],

      // set ipfs provider
      ipfsProvider: { host: 'ipfs.infura.io', port: 5001, protocol: 'https' },
    }, function (getCampaignError, campaignsResult) {
      console.log(getCampaignError, campaignsResult);

      done();
    });
  });

  it('should get a campaign from the testnet', (done) => {
    const campaignID1 = 0;
    const campaignID2 = 2;

    // get campaigns
    getCampaigns({
      // set network
      // or 'testnet'
      network: 'ropsten',

      // set campaign selector
      // array (i.e. array of campaignIDs)
      selector: [campaignID1, campaignID2],

      // set ipfs provider
      ipfsProvider: { host: 'ipfs.infura.io', port: 5001, protocol: 'https' },
    }, function (getCampaignError, campaignsResult) {
      // async callback with either error or camapign result
      assert.equal(typeof campaignsResult, 'object');
      assert.equal(typeof campaignsResult[campaignID1], 'object');
      assert.equal(typeof campaignsResult[campaignID1].addr, 'string');
      assert.equal(typeof campaignsResult[campaignID1].owner, 'string');
      assert.equal(typeof campaignsResult[campaignID1].name, 'string');
      assert.equal(typeof campaignsResult[campaignID1].balance, 'object');
      assert.equal(typeof campaignsResult[campaignID1].fundingGoal, 'object');
      assert.equal(typeof campaignsResult[campaignID1].fundingCap, 'object');
      assert.equal(isValidWeb3Address(campaignsResult[campaignID1].addr, web3), true);
      assert.equal(isValidWeb3Address(campaignsResult[campaignID1].owner, web3), true);

      assert.equal(typeof campaignsResult, 'object');
      assert.equal(typeof campaignsResult[campaignID2], 'object');
      assert.equal(typeof campaignsResult[campaignID2].addr, 'string');
      assert.equal(typeof campaignsResult[campaignID2].owner, 'string');
      assert.equal(typeof campaignsResult[campaignID2].name, 'string');
      assert.equal(typeof campaignsResult[campaignID2].balance, 'object');
      assert.equal(typeof campaignsResult[campaignID2].fundingGoal, 'object');
      assert.equal(typeof campaignsResult[campaignID2].fundingCap, 'object');
      assert.equal(isValidWeb3Address(campaignsResult[campaignID2].addr, web3), true);
      assert.equal(isValidWeb3Address(campaignsResult[campaignID2].owner, web3), true);

      done();
    });
  });
});
