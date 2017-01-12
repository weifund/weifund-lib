const assert = require('chai').assert;
const Web3 = require('web3');
const web3 = new Web3();

// get campaigns method
const getCampaigns = require('../index').getCampaigns;

// utils
const utils = require('../utils');
const isValidWeb3Address = utils.isValidWeb3Address;

describe('getCampaigns', () => {
  it('should get a campaign from the testnet', (done) => {
    // get campaigns
    getCampaigns({
      // set network
      // or 'testnet'
      network: 'ropsten',

      // set campaign selector
      // array (i.e. array of campaignIDs)
      selector: [0],

      // set ipfs provider
      ipfsProvider: { host: 'ipfs.infura.io', port: 5001, protocol: 'https' },
    }, function (getCampaignError, campaignsResult) {
      // async callback with either error or camapign result
      console.log(getCampaignError, campaignsResult); // eslint-disable-line

      assert.equal(typeof campaignsResult, 'object');
      assert.equal(typeof campaignsResult[0], 'object');
      assert.equal(typeof campaignsResult[0].addr, 'string');
      assert.equal(typeof campaignsResult[0].owner, 'string');
      assert.equal(typeof campaignsResult[0].name, 'string');
      assert.equal(typeof campaignsResult[0].balance, 'object');
      assert.equal(typeof campaignsResult[0].fundingGoal, 'object');
      assert.equal(typeof campaignsResult[0].fundingCap, 'object');
      assert.equal(isValidWeb3Address(campaignsResult[0].addr, web3), true);
      assert.equal(isValidWeb3Address(campaignsResult[0].owner, web3), true);

      done();
    });
  });
});
