const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class Size extends Model { };

Size.init({
    size_name: DataTypes.TEXT,
}, {
    sequelize: connection,
    tableName: "size"
});

module.exports = Size;