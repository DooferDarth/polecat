'use strict';

const assert = require('assert');
const buffer = require('../../../../src\services\picture\hooks\buffer.js');

describe('picture buffer hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    buffer()(mockHook);

    assert.ok(mockHook.buffer);
  });
});
