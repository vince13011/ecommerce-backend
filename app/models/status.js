const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class Status extends Model { };

Status.init({
    status_name: DataTypes.TEXT,
}, {
    sequelize: connection,
    tableName: "status"
});

module.exports = Status;