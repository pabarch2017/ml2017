'use strict';

const FileEngine = require('cacheman-file');

exports = module.exports = () => new FileEngine({});

exports['@singleton'] = true;
