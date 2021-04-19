import * as authentication from '@feathersjs/authentication';
import {
    alterItems,
    disallow,
    iff,
    isProvider,
    keep,
    populate,
    preventChanges,
    required,
    setNow,
    stashBefore
} from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const userSchema = {
    include: {
        service: 'users',
        nameAs: 'user',
        parentField: 'userId',
        childField: '_id'
    }
};

export default {
    before: {
        all: [
            authenticate('jwt'),
            required('text'),
            iff(context => context.params.query?.text.length > 10000, disallow()),
        ],
        find: [],
        get: [],
        create: [
            iff(isProvider('external'), keep('text')),
            setNow('createdAt', 'updatedAt')
        ],
        update: [
            disallow('external')
        ],
        patch: [
            stashBefore('msg'),
            iff(context => context.params.user?._id != context.params.msg.user?._id, disallow()),
            iff(isProvider('external'), keep('text')),
            setNow('updatedAt')
        ],
        remove: [
            stashBefore('msg'),
            iff(context => context.params.user?._id != context.params.msg.user?._id, disallow())
        ]
    },

    after: {
        all: [
            populate({schema: userSchema})
        ],
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
