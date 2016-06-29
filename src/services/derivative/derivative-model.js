'use strict';

// derivative-model.js - A just a generic object literal model
const validator = require('validator');

const derivativeModel = {
    name: {
        type: String,
        required: true,
        prop: data => data.name,
        validator: [
            {
                validate: data => !validator.isNull(data.name),
                message: "Name cannot be empty."
            }
        ]
    },
    age: {
        type: Number,
        required: false,
        min: 0,
        prop: data => data.age,
        validator: [
            {
                validate: data => Number.isSafeInteger(data.age),
                message: "Age must be a valid integer."
            },
            {
                validate: data => data.age >= derivativeModel.age.min,
                message: "Age must not be negative."
            }
        ]
    }
};

module.exports = derivativeModel;
