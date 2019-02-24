'use strict';

const createId = require('./create-id');

const removeDerivatives = require('./remove-derivatives');

const createInitialDerivative = require('./create-initial-derivative');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

const model = require('../character-model');
const derivModel = require('../../derivative/derivative-model');

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
        createId(),
        createInitialDerivative(),
        hooks.pluck('_id', 'userId', 'defaultId'),
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
            roles: [ 'admin', 'host' ],
            fieldName: 'roles',
            ownerField: 'userId',
            owner: true
        }),
        removeDerivatives()
    ]
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [
        hooks.populate('derivatives', { service: 'derivatives', field: 'derivativeIds'}),
        hooks.populate('default', { service: 'derivatives', field: 'defaultId'})
    ],
    update: [],
    patch: [],
    remove: []
};
