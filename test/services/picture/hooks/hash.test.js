'use strict';

const assert = require('assert');
const hash = require('../../../../src\services\picture\hooks\hash.js');

describe('picture hash hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    hash()(mockHook);

    assert.ok(mockHook.hash);
  });
});
