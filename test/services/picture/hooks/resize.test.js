'use strict';

const assert = require('assert');
const resize = require('../../../../src\services\picture\hooks\resize.js');

describe('picture resize hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        resize()(mockHook);

        assert.ok(mockHook.resize);
    });
});
