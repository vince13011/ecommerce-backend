const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class Role extends Model { };

Role.init({
    name: DataTypes.TEXT,
}, {
    sequelize: connection,
    tableName: "role"
});

module.exports = Role;