'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

const model = require('../user-model');

exports.before = {
    all: [],
    find: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
    ],
    get: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
    ],
    create: [
        globalHooks.required({ model: model }),
        globalHooks.validate({ model: model }),
        auth.hashPassword()
    ],
    update: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.restrictToOwner({ ownerField: '_id' }),
        globalHooks.validate({ model: model })
    ],
    patch: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.restrictToOwner({ ownerField: '_id' }),
        globalHooks.validate({ model: model })
    ],
    remove: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.restrictToOwner({ ownerField: '_id' })
    ]
};

exports.after = {
    all: [hooks.remove('password')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
