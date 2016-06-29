'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

const model = require('../message-model');

// Used to check if two single-level arrays match by value
const arrayEquals = (first, second) => first.length === second.length && first.every(value => second.includes(value));

exports.before = {
    all: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
    ],
    find: [],
    get: [],
    create: [
        globalHooks.required({ model: model}),
        globalHooks.validate({ model: model}),
        hook => {
            hook.data.edits = [];

            return hook;
        },
        globalHooks.createdAt(),
        globalHooks.modifiedAt()
    ],
    update: [
        hooks.disable()
    ],
    patch: [
        auth.restrictToOwner(),
        // Disable externally if it does not only contain a message change
        hooks.disable('external', hook => !arrayEquals(Object.getOwnPropertyNames(hook.data), [ "message" ])),
        // Disable externally if it is marked as deleted, even if it contains only a message change
        hooks.disable('external', hook => this.get(hook.id, hook.params).then(data => data.deleted)),
        globalHooks.validate({ model: model}),
        hook => {
            // If it contains a message change
            if(hook.data.message) {
                this.get(hook.id, hook.params).then(data => {
                    hook.data.edits = data.edits.concat([{
                        "message": data.message,
                        "createdAt": data.createdAt()
                    }]);

                    return hook;
                })
            }

            return hook;
        },
        globalHooks.createdAt(hook => hook.data.message),
        globalHooks.modifiedAt()
    ],
    remove: [
        auth.restrictToRoles({
            roles: [ 'admin', 'host' ],
            fieldName: 'roles',
            ownerField: 'userId',
            owner: true
        }),
        hook => this.patch(hook.id, { deleted: true }, hook.params).then(data => {
            hook.result = data;

            return hook;
        })
    ]
};

exports.after = {
    all: [],
    find: [
        // Remove message info if it's found to be marked deleted.
        hooks.remove('message', hook => hook.result.deleted)
    ],
    get: [
        // Remove message info if it's found to be marked deleted.
        hooks.remove('message', hook => hook.result.deleted)
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
};
