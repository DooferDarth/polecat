import assert from 'assert';
import app from '../src/app';

describe('authentication', () => {
    it('registered the authentication service', () => {
        assert.ok(app.service('authentication'));
    });

    // describe('discord strategy', () => {
    //     before(async () => {
    //         await create_user();
    //     });
    //
    //     it('authenticates user and creates accessToken', async () => {
    //         const {user, accessToken} = await app.service('authentication').create({
    //             strategy: 'discord',
    //             ...userInfo
    //         }, {});
    //
    //         assert.ok(accessToken, 'Created access token for user');
    //         assert.ok(user, 'Includes user in authentication data');
    //     });
    // });
});
