import * as feathersAuthentication from '@feathersjs/authentication';
import {disallow} from "feathers-hooks-common";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;

export default {
    before: {
        all: [],
        find: [ authenticate('jwt') ],
        get: [ authenticate('jwt') ],
        create: [],
        update: [ authenticate('jwt'), disallow('external') ],
        patch: [ authenticate('jwt') ],
        remove: [ authenticate('jwt'), disallow('external') ]
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
