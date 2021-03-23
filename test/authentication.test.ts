import assert from 'assert';
import app from '../src/app';

describe('authentication', () => {
    it('registered the authentication service', () => {
        assert.ok(app.service('authentication'));
    });

    describe('discord strategy', () => {
        // An example account that's not used for anything beyond testing
        const userInfo = {
            email: 'darthchaos2005@msn.com',
            discordId: '823737099332616216',
            avatar: 'https://cdn.discordapp.com/avatars/823737099332616216/3936a0db6677ea8679da89a9e4c614ca.png',
            name: 'Len#8486'
        };

        beforeEach(async () => {
            try {
                await app.service('users').create(userInfo);
            } catch (error) {
                // Do nothing, it just means the user already exists and can be tested
            }
        });

        it('authenticates user and creates accessToken', async () => {
            const {user, accessToken} = await app.service('authentication').create({
                strategy: 'discord',
                ...userInfo
            }, {});

            assert.ok(accessToken, 'Created access token for user');
            assert.ok(user, 'Includes user in authentication data');
        });
    });
});
