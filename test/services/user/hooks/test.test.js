'use strict';

const assert = require('assert');
const test = require('../../../../src\services\user\hooks\test.js');

describe('user test hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        test()(mockHook);

        assert.ok(mockHook.test);
    });
});
