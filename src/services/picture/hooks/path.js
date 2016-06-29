'use strict';

// src\services\picture\hooks\path.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const path = require('path');

// const defaults = {};
const extensions = {
    "image/png": "png",
    "image/gif": "gif",
    "image/jpeg": "jpg"
};

// Used to determine how many subdirectories to use
const depth = 2;

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => {
        // Combine the path as 'images/hash[0]/hash[1]/.../hash[DEPTH]/hash.ext'
        // Use spread operator to separate the beginning characters of hash to subdirectories
        // Use subdirectories to avoid too many files under any one particular directory
        hook.data.path = path.join(hook.app.get('images'), ...hook.data._id.substr(0, DEPTH), `${hook.data._id}.${extensions[hook.data.mimetype]}`);

        return hook;
    };
};
