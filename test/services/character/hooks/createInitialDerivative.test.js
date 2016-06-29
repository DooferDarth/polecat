'use strict';

const assert = require('assert');
const createInitialDerivative = require('../../../../src\services\character\hooks\create-initial-derivative.js');

describe('character create-initial-derivative hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    createInitialDerivative()(mockHook);

    assert.ok(mockHook.createInitialDerivative);
  });
});
