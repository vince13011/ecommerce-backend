const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class Category extends Model { };

Category.init({
    title: DataTypes.TEXT
}, {
    sequelize: connection,
    tableName: "category",
});

module.exports = Category;