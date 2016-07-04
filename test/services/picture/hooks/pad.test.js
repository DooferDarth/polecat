'use strict';

const assert = require('assert');
const pad = require('../../../../src\services\picture\hooks\pad.js');

describe('picture pad hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    pad()(mockHook);

    assert.ok(mockHook.pad);
  });
});
