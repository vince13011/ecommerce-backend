const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class User extends Model { };

User.init({
    email: DataTypes.TEXT,
    firstname: DataTypes.TEXT,
    lastname: DataTypes.TEXT,
    password: DataTypes.TEXT,
    phone_number: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
}, {
    sequelize: connection,
    tableName: "user"
});

module.exports = User;