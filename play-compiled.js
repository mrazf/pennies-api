'use strict';

var test = require('./build/src/monzo/get-token');
var monzoAppConfig = require('./src/config/private/monzoClientDetails');

test({ config: monzoAppConfig });
