#!/usr/bin/env node

// require utils
const utils = require('./utils');

// default module export
const someDefaultModuleExport = function () {
  console.log('Im the default module!', utils.oneDay); // eslint-disable-line
};

// export default object
module.exports = someDefaultModuleExport;
