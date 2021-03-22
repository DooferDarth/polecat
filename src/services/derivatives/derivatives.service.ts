// Initializes the `derivatives` service on path `/derivatives`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Derivatives } from './derivatives.class';
import createModel from '../../models/derivatives.model';
import hooks from './derivatives.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'derivatives': Derivatives & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/derivatives', new Derivatives(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('derivatives');

    service.hooks(hooks);
}
