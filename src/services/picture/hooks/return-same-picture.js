'use strict';

// src\services\picture\hooks\return-same-picture.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => this.get(hook.data._id)
        .then(data => {
            hook.result = data;

            return hook;
        })
        .catch(err => {
            if (err.code === 404) {
                return hook;
            }
            else {
                throw err;
            }
        });
};
