import { Params } from '@feathersjs/feathers';
import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application } from '../../declarations';

export interface UserData {
    _id?: string;
    email?: string;
    discordId: string;
    name?: string;
    avatar?: string;
}

export class Users extends Service<UserData> {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<NedbServiceOptions>, app: Application) {
        super(options);
    }

    create(data: UserData, params?: Params): Promise<any> {
        const { email, discordId, name, avatar } = data;
        const userData = {
            email,
            discordId,
            name,
            avatar
        };

        return super.create(userData, params);
    }
}
