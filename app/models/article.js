const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class Article extends Model { };

Article.init({
    reference: DataTypes.TEXT,
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT,
    color: {
        type: DataTypes.TEXT,
        defaultValue: 'NULL'
    },
    pre_tax_price: DataTypes.INTEGER,
    vat_rate: DataTypes.INTEGER,
    discount: {
        type: DataTypes.INTEGER,
        defaultValue: 'NULL'
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
}, {
    sequelize: connection,
    tableName: "article"
});

module.exports = Article;