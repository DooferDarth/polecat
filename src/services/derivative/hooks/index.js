'use strict';

const addFull = require('./add-full');
const addIcon = require('./add-icon');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

const model = require('../derivative-model');
const pictureModel = require('../../picture/picture-model');

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
        globalHooks.required({ data: "icon", model: pictureModel }),
        globalHooks.required({ data: "full", model: pictureModel }),
        globalHooks.validate({ model: model }),
        globalHooks.validate({ data: "icon", model: pictureModel }),
        globalHooks.validate({ data: "full", model: pictureModel }),
        addIcon(),
        addFull(),
        hooks.remove('full', 'icon'),
        auth.associateCurrentUser(),
        globalHooks.createdAt(),
        globalHooks.modifiedAt()
    ],
    update: [
        auth.restrictToOwner({ ownerField: 'userId' }),
        globalHooks.validate({ model: model }),
        globalHooks.validate({ data: "icon", model: pictureModel }),
        globalHooks.validate({ data: "full", model: pictureModel }),
        addIcon(),
        addFull(),
        hooks.remove('full', 'icon'),
        globalHooks.modifiedAt()
    ],
    patch: [
        auth.restrictToOwner({ ownerField: 'userId' }),
        globalHooks.validate({ model: model }),
        globalHooks.validate({ data: "icon", model: pictureModel }),
        globalHooks.validate({ data: "full", model: pictureModel }),
        addIcon(),
        addFull(),
        hooks.remove('full', 'icon'),
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
