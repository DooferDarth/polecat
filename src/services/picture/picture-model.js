'use strict';

// picture-model.js - A just a generic object literal model

const validator = require('validator');
const imageType = require('image-type');
const Enum = require('symbol-enum');

const base64Length = bytes => roundToNearestFactor(4 * bytes / 3, 4);
const roundToNearestFactor = (num, factor) => Math.ceil(num / factor) * factor;

const MIMETYPES = new Enum("image/png", "image/jpeg", "image/gif");
const TYPES = new Enum("icon", "full");
const IMAGE_HEADER_BYTE_LENGTH = 12;
// Max size of: 10 MiB (10,485,760 bytes)
const MAX_SIZE = 10 * Math.pow(1024, 2);

const pictureModel = {
    mimetype: {
        type: String,
        values: MIMETYPES,
        required: true,
        prop: data => data.mimetype,
        validator: [
            {
                validate: data => MIMETYPES[Enum.has](data.mimetype),
                message: `The given mimetype is not supported. Must be of any: ${Array.from(MIMETYPES[Enum.keys]()).join(', ')}`
            }
        ]
    },
    type: {
        type: String,
        values: TYPES,
        required: false,
        default: "full",
        prop: data => data.type,
        validator: [
            {
                validate: data => TYPES[Enum.has](data.type),
                message: `Image type must be of any: ${Array.from(TYPES[Enum.keys]()).join(', ')}`
            }
        ]
    },
    raw: {
        type: String,
        required: true,
        prop: data => data.raw,
        validator: [
            {
                validate: data => validator.isBase64(data.raw),
                message: "Not a valid base64 string."
            },
            {
                // Derived from image-type needing the first 12 bytes
                validate: data => validator.isLength(data.raw, { min: base64Length(IMAGE_HEADER_BYTE_LENGTH) }),
                message: `Image data must at least ${IMAGE_HEADER_BYTE_LENGTH} bytes long.`
            },
            {
                validate: data => validator.isLength(data.raw, { max: base64Length(MAX_SIZE) }),
                message: `Image data must be less than or equal to ${MAX_SIZE / Math.pow(1024, 2)}
MiB (${MAX_SIZE.toLocaleString('en-US')} bytes).`
            },
            {
                validate: data => {
                    let image = imageType(Buffer.from(data.raw.substr(0, base64Length(IMAGE_HEADER_BYTE_LENGTH)), 'base64'));

                    return image && MIMETYPES[Enum.has](image.mime);
                },
                message: `The image data's determined mimetype is not supported. Must be of any: ${Array.from(MIMETYPES[Enum.keys]()).join(', ')}`
            },
            {
                validate: data => data.mimetype === imageType(Buffer.from(data.raw.substr(0,
                    base64Length(IMAGE_HEADER_BYTE_LENGTH)), 'base64')).mime,
                message: "The request mimetype does not match the determined mimetype."
            }
        ]
    }
};

module.exports = pictureModel;
