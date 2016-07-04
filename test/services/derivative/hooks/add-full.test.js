'use strict';

const assert = require('assert');
const addFull = require('../../../../src\services\derivative\hooks\add-full.js');

describe('derivative addFull hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        addFull()(mockHook);

        assert.ok(mockHook.addFull);
    });
});
