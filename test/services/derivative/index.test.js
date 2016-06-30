'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('derivative service', function () {
    it('registered the derivatives service', () => {
        assert.ok(app.service('derivatives'));
    });
});
