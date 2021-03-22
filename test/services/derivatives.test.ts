import assert from 'assert';
import app from '../../src/app';

describe('\'derivatives\' service', () => {
    it('registered the service', () => {
        const service = app.service('derivatives');

        assert.ok(service, 'Registered the service');
    });
});
