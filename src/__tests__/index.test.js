const assert = require('chai').assert;
// get campaigns method
/* const Web3 = require('web3');
const getCampaigns = require('../index').getCampaigns;


describe('getCampaigns', () => {
  it('should get 4 campaigns from the testnet', (done) => {
    // get campaigns
    getCampaigns({
      // set network
      // or 'testnet'
      network: 'testnet',

      // set campaign selector
      // array (i.e. array of campaignIDs)
      selector: [1, 4, 5, 10],

      // set web3 provider
      web3Provider: new Web3.providers.HttpProvider('https://morden.infura.io/'),

      // set ipfs provider
      ipfsProvider: { host: 'ipfs.infura.io', port: '5001', protocol: 'https' },
    }, function (getCampaignError, campaignsResult) {
      // async callback with either error or camapign result
      // console.log(getCampaignError, campaignsResult); // eslint-disable-line

      console.log(getCampaignError, Object.keys(campaignsResult));

      assert.equal(typeof campaignsResult, 'object');
      // assert.equal(Object.keys(campaignsResult).length, 4);
      done();
    });
  });
}); */

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal(-1, [1, 2, 3].indexOf(5));
      assert.equal(-1, [1, 2, 3].indexOf(0));
    });
  });
});
