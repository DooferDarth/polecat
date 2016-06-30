'use strict';

// Global Event Filters

// exports.myFilter = (data, connection, hook) => data;
exports.authenticated = (data, connection, hook) => !connection.user ? false : data;
