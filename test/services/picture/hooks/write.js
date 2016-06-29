'use strict';

const assert = require('assert');
const write = require('../../../../src\services\picture\hooks\write.js');

describe('picture write hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        write()(mockHook);

        assert.ok(mockHook.writeToDisk);
    });
});
