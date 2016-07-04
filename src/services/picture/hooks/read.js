'use strict';

// src\services\picture\hooks\read-from-disk.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const fs = require('fs');
const path = require('path');

// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => {
        return new Promise((resolve, reject) => {
            if([ "find", "create", "remove" ].includes(hook.method) && Array.isArray(hook.result.data)) {
                hook.result.data.forEach(picture => {
                    fs.readFile(path.join(hook.app.get('nedb'), picture.path), (err, buffer) => {
                        if(err) {
                            reject(err);
                        }
                        else {
                            picture.raw = buffer.toString('base64');
                        }
                    })
                });

                resolve(hook);
            }
            else {
                fs.readFile(path.join(hook.app.get('nedb'), hook.result.path), (err, buffer) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        hook.result.raw = buffer.toString('base64');

                        resolve(hook);
                    }
                });
            }
        })
    };
};
