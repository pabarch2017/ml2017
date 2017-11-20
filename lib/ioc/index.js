'use strict';

const container = require('electrolyte');
const path = require('path');
const config = require('config');
const winston = require('winston');

winston.configure({
    transports: [
        new winston.transports.Console(config.get('logging'))
    ]
});

container.use(container.dir(path.join(__dirname, './dependencies')));

module.exports = container;
