'use strict';

// src\services\character\hooks\remove-derivatives.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const errors = require('feathers-errors');

// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => new Promise((resolve, reject) => {
        const derivativeService = hook.app.service('derivatives');

        // Find all derivatives matching the character id.
        derivativeService.find({ query: { charId: hook.id }})
            .then(result => {
                // Remove on all derivative ids, and wait until they've all finished.
                Promise.all(Array.from(result, deriv => derivativeService.remove(deriv._id))
                        .catch(err => {
                            // For all non-NotFound errors, reject with error.
                            if(err !== errors.NotFound) {
                                reject(err);
                            }
                        }))
                // If nothing goes wrong, resolve with hook.
                    .then(() => resolve(hook));
                }
            );
    });
};
