'use strict';

// src\services\picture\hooks\write-to-disk.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => new Promise((resolve, reject) => {
        // Attempt to recursively make the images directory and all the path's subdirectories
        mkdirp(path.join(hook.app.get('nedb'), hook.app.get('images'), path.dirname(hook.data.path)), err => {
            if(err) {
                reject(err);
            }
            else {
                fs.writeFile(path.join(hook.app.get('nedb'), hook.data.path), hook.data.buffer, err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(hook);
                    }
                });
            }
        });
    });
};
