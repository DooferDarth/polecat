'use strict';

// src\services\picture\hooks\resize.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const resizer = require('lwip');

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

        resizer.open(hook.data.buffer, encodings[hook.data.mimetype], (err, image) => {
            let batch = image.batch();
            if(image.width() !== image.height()) {
                let difference = Math.abs(image.width() - image.height());
                if(image.width() > image.height()) {
                    batch.pad(0, Math.ceil(difference / 2), 0, Math.floor(difference / 2), [255, 255, 255, 0]);
                }
                else {
                    batch.pad(Math.floor(difference / 2), 0, Math.ceil(difference / 2), 0, [255, 255, 255, 0]);
                }
            }
            if(image.width() > size && image.height() > size) {
                batch.resize(size);
            }
            batch.toBuffer(encodings[hook.data.mimetype], (err, buffer) => {
                if (err) {
                    reject(err);
                }
                else {
                    hook.data.buffer = buffer;

                    resolve(hook);
                }
            });
        })
    });
};
