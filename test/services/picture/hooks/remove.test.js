'use strict';

const assert = require('assert');
const remove = require('../../../../src\services\picture\hooks\remove.js');

describe('picture remove hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    remove()(mockHook);

    assert.ok(mockHook.remove);
  });
});
