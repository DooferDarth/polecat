'use strict';

const remove = require('./remove');

const path = require('./path');

const buffer = require('./buffer');

const hash = require('./hash');

const read = require('./read');
const write = require('./write');
const resize = require('./resize');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const errors = require('feathers-errors');

const model = require('../picture-model');

exports.before = {
    all: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
    ],
    find: [],
    get: [],
    create: [
        globalHooks.required({ model: model }),
        globalHooks.validate({ model: model }),
        buffer(),
        hash(),
        hook => hook.app.service('pictures').get(hook.data._id)
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
            }),
        path(),
        resize(160, hook => hook.data.type === 'icon'),
        // resize(800, hook => !hook.data.type || hook.data.type === 'full'),
        write(),
        hooks.pluck('_id', 'path', 'type', 'mimetype'),
        auth.associateCurrentUser(),
        globalHooks.createdAt()
    ],
    update: [hooks.disable()],
    patch: [hooks.disable()],
    remove: [
        // Disallow globally deleting pictures externally
        hooks.disable('external', hook => !hook.id),
        auth.restrictToRoles({
            roles: [ 'admin', 'host' ],
            fieldName: 'roles',
            ownerField: 'userId',
            owner: true
        }),
        remove()
    ]
};

exports.after = {
    all: [],
    find: [
        read(),
        hooks.remove('path')
    ],
    get: [
        read(),
        hooks.remove('path')
    ],
    create: [
        read(),
        hooks.remove('path')
    ],
    update: [],
    patch: [],
    remove: []
};
