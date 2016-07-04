'use strict';

const assert = require('assert');
const addIcon = require('../../../../src\services\derivative\hooks\add-icon.js');

describe('derivative addIcon hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        addIcon()(mockHook);

        assert.ok(mockHook.addIcon);
    });
});
