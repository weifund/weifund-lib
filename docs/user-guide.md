# User Guide

All information for developers using weifund-lib should consult this document.

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

## About

The WeiFund library. This contains all methods needed to pull campaign data from IPFS or the blockchain.
