'use strict';

// src\services\message\hooks\process.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function (options) {
    options = Object.assign({}, defaults, options);

    return function (hook) {
        hook.process = true;

        const user = hook.params.user;
        const text = hook.data.text
            .substring(0, 400)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/, '&gt;');

        hook.data = {
            text,
            userId: user._id,
            createAt: new Data().getTime()
        };
    };
};
