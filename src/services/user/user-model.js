'use strict';

// user-model.js - A just a generic object literal model
const validator = require('validator');

const EMAIL_LENGTH_LIMIT = 254;
const PASSWORD_LENGTH_MIN = 6;

const userModel = {
    email: {
        type: String,
        required: true,
        index: true,
        // Based on the standard
        max: EMAIL_LENGTH_LIMIT,
        validator: [
            {
                validate: (data) => !validator.isNull(data.email),
                message: "Email cannot be empty."
            },
            {
                validate: (data) => validator.isEmail(data.email),
                message: "Email is not a valid email."
            },
            {
                validate: (data) => validator.isLength(data.email, { max: userModel.email.max }),
                message: `Email cannot be any longer than ${EMAIL_LENGTH_LIMIT} characters.`
            }
        ]
    },
    password: {
        type: String,
        required: true,
        index: true,
        min: 6,
        validator: [
            {
                validate: (data) => !validator.isNull(data.password),
                message: "Password cannot be empty."
            },
            {
                validate: (data) => validator.isLength(data.email, { min: userModel.password.min }),
                message: `Password cannot be any shorter than ${PASSWORD_LENGTH_MIN} characters.`
            }
        ]
    },
    display: {
        type: String,
        required: true,
        index: true,
        validator: [
            {
                validate: (data) => !validator.isNull(data.password),
                message: "Display name cannot be empty."
            }
        ]
    }
};

module.exports = userModel;
