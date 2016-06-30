'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

const model = require('../derivative-model');

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
        auth.associateCurrentUser(),
        globalHooks.createdAt(),
        globalHooks.modifiedAt()
    ],
    update: [
        auth.restrictToOwner({ ownerField: 'userId' }),
        globalHooks.validate({ model: model }),
        globalHooks.modifiedAt()
    ],
    patch: [
        auth.restrictToOwner({ ownerField: 'userId' }),
        globalHooks.validate({ model: model }),
        globalHooks.modifiedAt()
    ],
    remove: [
        auth.restrictToRoles({
            roles: ['admin', 'host'],
            fieldName: 'roles',
            ownerField: 'userId',
            owner: true
        })
    ]
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
