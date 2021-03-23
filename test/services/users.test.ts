import assert from 'assert';
import app from '../../src/app';
import {remove_user, userInfo} from '../users.helper';

describe('\'users\' service', () => {
    beforeEach(async () => {
        await remove_user();
    });

    it('registered the service', () => {
        const service = app.service('users');

        assert.ok(service, 'Registered the service');
    });

    it('creates a user', async () => {
        const user = await app.service('users').create(userInfo);
        // Verify Gravatar has been set as we'd expect
        // assert.strictEqual(user.avatar, 'https://s.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?s=60');
        // // Makes sure the password got encrypted
        // assert.ok(user.password !== 'secret');

        assert.ok(user, 'Created a user successfully');

        assert.strictEqual(user['email'], userInfo.email);
        assert.strictEqual(user['discordId'], userInfo.discordId);
        assert.strictEqual(user['avatar'], userInfo.avatar);
        assert.strictEqual(user['name'], userInfo.name);
    });

    // it('removes password for external requests', async () => {
    //     // Setting `provider` indicates an external request
    //     const params = { provider: 'rest' };
    //
    //     const user = await app.service('users').create({
    //         email: 'test2@example.com',
    //         password: 'secret'
    //     }, params);
    //
    //     // Make sure password has been removed
    //     assert.ok(!user.password);
    // });
});
