'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('character service', function () {
    it('registered the characters service', () => {
        assert.ok(app.service('characters'));
    });
});
