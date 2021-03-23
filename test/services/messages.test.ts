import assert from 'assert';
import app from '../../src/app';
import {create_user, get_user} from '../users.helper';

describe('\'messages\' service', () => {
    beforeEach(async () => {
        await create_user();
    });

    it('registered the service', () => {
        const service = app.service('messages');

        assert.ok(service, 'Registered the service');
    });

    it('creates and processes message, adds user information', async () => {
        const user = await get_user();

        // The messages service call params (with the user we just created)
        const params = {user};
        const message = await app.service('messages').create({
            text: 'a test',
            additional: 'should be removed'
        }, params);

        assert.strictEqual(message.text, 'a test');
        // `userId` should be set to passed users it
        assert.strictEqual(message.userId, user._id);
        // Additional property has been removed
        assert.ok(!message.additional);
        // `user` has been populated
        assert.deepStrictEqual(message.user, user);
    });
});
