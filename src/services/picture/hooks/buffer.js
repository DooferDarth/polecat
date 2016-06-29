'use strict';

// src\services\picture\hooks\buffer.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => {
        hook.data.buffer = Buffer.from(hook.data.raw, 'base64');

        return hook;
    };
};
