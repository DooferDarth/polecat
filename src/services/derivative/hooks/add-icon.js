'use strict';

// src\services\derivative\hooks\add-icon.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => {
        const pictureService = hook.app.service('pictures');

        if(!hook.data.icon) {
            return hook;
        }

        return pictureService.create(Object.assign({}, hook.data.icon, { type: "icon" }))
            .then(data => {
                hook.data.iconId = data.id;

                return hook;
            });
    };
};
