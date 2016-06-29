'use strict';

// src\services\picture\hooks\hash.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html


// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => {
        const hash = require('crypto').createHash('sha1');
        
        hash.update(hook.data.buffer);

        hook.data._id = hash.digest('hex');

        return hook;
    };
};
