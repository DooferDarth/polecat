'use strict';

// src\services\picture\hooks\pad.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const sharp = require('sharp');

// const defaults = {};
const encodings = {
    "image/png": "png",
    "image/gif": "gif",
    "image/jpeg": "jpg"
};

module.exports = test => {
    // options = Object.assign({}, defaults, options);

    return hook => new Promise((resolve, reject) => {
        if (test && !test(hook)) {
            resolve(hook);
        }

        const image = sharp(hook.data.buffer);

        image.metadata((err, metadata) => {
            if (err) {
                reject(err);
            }
            else {
                if(metadata.width !== metadata.height) {
                    let difference = Math.abs(metadata.width - metadata.height);

                    let options = {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: { r: 255, g: 255, b: 255, alpha: 0 }
                    };

                    if(metadata.width > metadata.height) {
                        options[left] = Math.ceil(difference / 2);
                        options[right] = Math.floor(difference / 2);
                    }
                    else {
                        options[top] = Math.ceil(difference / 2);
                        options[bottom] = Math.floor(difference / 2);
                    }

                    image
                        .extend(options)
                        .toFormat(encodings[hook.data.mimetype])
                        .toBuffer((err, buffer, info) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                hook.data.buffer = buffer;
            
                                resolve(hook);
                            }
                        });
                }
                else {
                    resolve(hook);
                }
            }
        });  
    });
};
