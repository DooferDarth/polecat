'use strict';

const assert = require('assert');
const returnSamePicture = require('../../../../src\services\picture\hooks\return-same-picture.js');

describe('picture returnSamePicture hook', function () {
    it('hook can be used', function () {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        returnSamePicture()(mockHook);

        assert.ok(mockHook.returnSamePicture);
    });
});
