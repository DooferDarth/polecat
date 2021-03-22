// Initializes the `characters` service on path `/characters`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Characters } from './characters.class';
import createModel from '../../models/characters.model';
import hooks from './characters.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'characters': Characters & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/characters', new Characters(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('characters');

    service.hooks(hooks);
}
