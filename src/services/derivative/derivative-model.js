'use strict';

// derivative-model.js - A just a generic object literal model
const validator = require('validator');

const Picture = require('../picture/picture-model');

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
    charId: {
        type: String,
        required: true,
        prop: data => data.charId,
        validator: [
            {
                validate: data => !validator.isNull(data.charId),
                message: "Character Id cannot be null."
            },
            {
                validate: data => !validator.isHexadecimal(data.charId),
                message: "Character Id cannot be null."
            }
        ]
    },
    icon: {
        type: Picture,
        required: false,
        prop: data => data.icon
    },
    full: {
        type: Picture,
        required: false,
        prop: data => data.full
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
