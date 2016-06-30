'use strict';

const globalFilters = require('../../../filters');

exports = {
    all: [globalFilters.authenticated],
    created: [],
    updated: [],
    patched: [],
    removed: []
};
