# Developer Guide

All information regarding contributing to and progressing weifund-lib can be found in this document.

## Install from Source

```
git clone http://github.com/weifund/weifund-lib
cd weifund-lib
npm install
```

## Install

```
npm install --save weifund-lib
```

## Usage

```js
// get campaigns method
const getCampaigns = require('weifund-lib').getCampaigns;

// get campaigns
getCampaigns({
  // set network
  // or 'testnet'
  network: 'ropsten',

  // set campaign selector
  // array (i.e. array of campaignIDs)
  selector: [0],
}, function (getCampaignError, campaignsResult) {
  // async callback with either error or camapign result
  console.log(campaignsResult);
});
```
