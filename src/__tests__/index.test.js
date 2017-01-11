const assert = require('chai').assert;
// get campaigns method
const getCampaigns = require('../index').getCampaigns;


describe('getCampaigns', () => {
  it('should get 4 campaigns from the testnet', (done) => {
    // get campaigns
    getCampaigns({
      // set network
      // or 'testnet'
      network: 'ropsten',

      // set campaign selector
      // array (i.e. array of campaignIDs)
      selector: [1],

      // set ipfs provider
      ipfsProvider: { host: 'ipfs.infura.io', port: 5001, protocol: 'https' },
    }, function (getCampaignError, campaignsResult) {
      // async callback with either error or camapign result
      console.log(getCampaignError, campaignsResult);

      assert.equal(typeof campaignsResult, 'object');
      done();
    });
  });
});
