'use strict';

const assert = require('assert');
const read = require('../../../../src\services\picture\hooks\read.js');

describe('picture read hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'after',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        read()(mockHook);

        assert.ok(mockHook.read);
    });
});
