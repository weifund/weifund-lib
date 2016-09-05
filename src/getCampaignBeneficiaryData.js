// get campaign beneficiary data
const getCampaignBeneficiaryData = function (options, callback) {
  const beneficiaryAddress = options.beneficiaryAddress;
  const web3 = options.web3;

  // setup data object
  const campaignDataObject = {
    beneficiaryContractCode: '0x',
  };

  // get beneficiary code
  web3.eth.getCode(beneficiaryAddress, function (beneficiaryContractCodeError, beneficiaryContractCode) {
    // handle code error
    if (beneficiaryContractCodeError) {
      return callback(beneficiaryContractCodeError, null);
    }

    campaignDataObject.beneficiaryContractCode = beneficiaryContractCode;

    // fire final callback
    callback(null, campaignDataObject);
  });
};

// export beneficiary data function
module.exports = getCampaignBeneficiaryData;
