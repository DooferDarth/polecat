import assert from 'assert';
import app from '../../src/app';

describe('\'messages\' service', () => {
    // An example account that's not used for anything beyond testing
    const userInfo = {
        email: 'darthchaos2005@msn.com',
        discordId: '823737099332616216',
        avatar: 'https://cdn.discordapp.com/avatars/823737099332616216/3936a0db6677ea8679da89a9e4c614ca.png',
        name: 'Len#8486'
    };

    beforeEach(async () => {
        // Cleanup so tests are independent
        try {
            await app.service('users').remove(null, { query: { discordId: userInfo.discordId }});
        } catch (error) {
            // Do nothing
        }
    })

    it('registered the service', () => {
        const service = app.service('messages');

        assert.ok(service, 'Registered the service');
    });

    it('creates and processes message, adds user information', async () => {
        const user = await app.service('users').create(userInfo);

        // The messages service call params (with the user we just created)
        const params = { user };
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
