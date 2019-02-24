'use strict';

// src\services\picture\hooks\resize.js
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

module.exports = (size, test) => {
    // options = Object.assign({}, defaults, options);

    return hook => new Promise((resolve, reject) => {
        if (test && !test(hook)) {
            resolve(hook);
        }

        sharp(hook.data.buffer)
            .resize(size, size, { "fit": "inside" })
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
    });
};
