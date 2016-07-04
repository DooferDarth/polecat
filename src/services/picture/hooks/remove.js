'use strict';

// src\services\picture\hooks\remove.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// const defaults = {};
const images = 'images';

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => {
        return new Promise((resolve, reject) => {
            // If not null, then delete singular picture
            if(hook.id) {
                this.get(hook.id, hook.params).then(data => {
                    fs.unlink(path.join(hook.app.get('nedb'), data.path), err => {
                        if(err) {
                            reject(err);
                        }
                        else {
                            resolve(hook);
                        }
                    });
                });
            }
            // Else null, and delete all files and subdirectories under 'images'
            else {
                rimraf(path.join(hook.app.get('nedb'), images), err => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(hook);
                    }
                });
            }
        })
    };
};
