'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

const errors = require('feathers-errors');

// exports.myHook = function (options) {
//     return function (hook) {
//         console.log('My custom global hook ran. Feathers is awesome!');
//     };
// };

exports.validate = options => hook => {
    if(!options.data) {
        options.data = hook.data;
    }
    else {
        options.data = hook.data[options.data];
    }
    for(let prop in options.model) {
        if (options.model.hasOwnProperty(prop)) {
            if (!options.model[prop].prop(options.data)) {
                continue;
            }

            for (var validator of options.model[prop].validator) {
                if (!validator.validate(options.data)) {
                    throw new errors.BadRequest('Validation Error', {
                        data: options.data,
                        message: validator.message
                    });
                }
            }
        }
    }
};
exports.required = options => hook => {
    if(!options.data) {
        options.data = hook.data;
    }
    else {
        options.data = hook.data[options.data];
    }
    for(let prop in options.model) {
        if (options.model.hasOwnProperty(prop)) {
            if (options.model[prop].required && !options.model[prop].prop(options.data)) {
                throw new errors.BadRequest('Missing Field', {
                    data: options.data,
                    message: `Data is missing required property '${prop}'`
                });
            }
        }
    }
};
exports.createdAt = test => hook => {
    if(!test || test(hook)) {
        hook.data.createdAt = Date.now();
    }

    return hook;
};
exports.modifiedAt = test => hook => {
    if(!test || test(hook)) {
        hook.data.modifiedAt = Date.now();
    }

    return hook;
};
