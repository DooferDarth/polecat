import * as authentication from '@feathersjs/authentication';
import {
    alterItems,
    disallow,
    iff,
    isProvider,
    keep,
    populate,
    required,
    setNow,
    stashBefore, validate
} from 'feathers-hooks-common';
import {HookContext} from '@feathersjs/feathers';
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

function msgValidator(values: any, context: HookContext) : { [key: string]: string } | null {
    if(values.text.length > 10000) {
        return { 'text': 'Message too long.' };
    }

    return null;
}


export default {
    before: {
        all: [
            authenticate('jwt'),
            required('text'),
            validate(msgValidator)
        ],
        find: [],
        get: [],
        create: [
            keep('text'),
            alterItems((msg, context) => msg.userId = context.params.user?._id),
            setNow('createdAt', 'updatedAt')
        ],
        update: [
            disallow('external')
        ],
        patch: [
            stashBefore('msg'),
            iff(context => context.params.user?._id != context.params.msg.userId, disallow()),
            iff(isProvider('external'), keep('text')),
            setNow('updatedAt')
        ],
        remove: [
            stashBefore('msg'),
            iff(context => context.params.user?._id != context.params.msg.userId, disallow())
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
