'use strict';

// icon-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    const icon = sequelize.define('icons', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        hash: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        data: {
            type: Sequelize.BLOB,
            allowNull: false,
            unique: true
        }
    }, {
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['hash']
            }
        ]
    });

    icon.sync();

    return icon;
};
