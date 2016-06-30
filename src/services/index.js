'use strict';
const picture = require('./picture');
const authentication = require('./authentication');
const user = require('./user');
const message = require('./message');
const character = require('./character');
const derivative = require('./derivative');

module.exports = function () {
    const app = this;

    app.configure(authentication);
    app.configure(user);
    app.configure(message);
    app.configure(character);
    app.configure(derivative);
    app.configure(picture);
};
