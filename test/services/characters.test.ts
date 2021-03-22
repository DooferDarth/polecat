import assert from 'assert';
import app from '../../src/app';

describe('\'characters\' service', () => {
    it('registered the service', () => {
        const service = app.service('characters');

        assert.ok(service, 'Registered the service');
    });
});
