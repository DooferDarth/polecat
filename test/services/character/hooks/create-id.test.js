'use strict';

const assert = require('assert');
const createId = require('../../../../src\services\character\hooks\create-id.js');

describe('character createId hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        createId()(mockHook);

        assert.ok(mockHook.createId);
    });
});
