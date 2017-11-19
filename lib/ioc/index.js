'use strict';

const container = require('electrolyte');
const path = require('path');

container.use(container.dir(path.join(__dirname, './dependencies')));

module.exports = container;
