const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class ArticleHasSize extends Model { };

ArticleHasSize = connection.define('article_has_size', {
    stock: DataTypes.INTEGER,
}, {
    sequelize: connection,
    tableName: "article_has_size"
})

module.exports = ArticleHasSize;