'use strict';

const assert = require('assert');
const removeDerivatives = require('../../../../src\services\character\hooks\remove-derivatives.js');

describe('character removeDerivatives hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    removeDerivatives()(mockHook);

    assert.ok(mockHook.removeDerivatives);
  });
});
