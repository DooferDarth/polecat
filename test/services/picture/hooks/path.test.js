'use strict';

const assert = require('assert');
const path = require('../../../../src\services\picture\hooks\path.js');

describe('picture path hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    path()(mockHook);

    assert.ok(mockHook.path);
  });
});
