import { Params, ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationRequest, AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { expressOauth, OAuthProfile, OAuthStrategy } from '@feathersjs/authentication-oauth';

import { Application } from './declarations';
import axios, { AxiosRequestConfig } from 'axios';

declare module './declarations' {
    interface ServiceTypes {
        'authentication': AuthenticationService & ServiceAddons<any>;
    }
}

class DiscordStrategy extends OAuthStrategy {
    async getEntityData(profile: OAuthProfile, existing: any, params: Params) {
        const baseData = await super.getEntityData(profile, existing, params);
        console.log(existing);

        if (profile.avatar) {
            const isGif = profile.avatar.startsWith('a_');
            profile.avatar = `https://cdn.discordapp.com/avatars/${profile['id']}/${profile['avatar']}.${isGif ? 'gif' : 'png'}`;
        } else {
            // TODO: Replace with default Polecat icon instead
            profile.avatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
        }

        return {
            ...baseData,
            name: `${profile.username}#${profile.discriminator}`,
            email: profile.email,
            avatar: profile.avatar,
        };
    }

    async getProfile(authResult: AuthenticationRequest) {
        const accessToken = authResult.access_token;
        const userOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            url: 'https://discord.com/api/users/@me'
        };

        const { data } = await axios(userOptions);
        return data;
    }
}

export default function (app: Application): void {
    const authentication = new AuthenticationService(app);

    authentication.register('jwt', new JWTStrategy());
    authentication.register('discord', new DiscordStrategy());

    app.use('/authentication', authentication);
    app.configure(expressOauth({}));
}
