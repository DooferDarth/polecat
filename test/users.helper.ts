import {UserData} from '../src/services/users/users.class';
import app from '../src/app';

// An example account that's not used for anything beyond testing
export const userInfo = {
    email: 'darthchaos2005@msn.com',
    discordId: '823737099332616216',
    avatar: 'https://cdn.discordapp.com/avatars/823737099332616216/3936a0db6677ea8679da89a9e4c614ca.png',
    name: 'Len#8486'
};

export async function get_user(): Promise<UserData> {
    const result = await app.service('users').find({$limit: 1, query: {discordId: userInfo.discordId}});
    // Check for pagination
    const [user] = 'data' in result ? result.data : result;

    return user;
}

export async function create_user(): Promise<void> {
    try {
        await app.service('users').create(userInfo);
    } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
    }
}

export async function remove_user(): Promise<void> {
    try {
        const user = await get_user();
        if(user._id) {
            await app.service('users').remove(user._id);
        }
    } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
    }
}
