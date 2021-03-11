const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class OrderHasArticle extends Model { };

OrderHasArticle = connection.define('order_has_article', {
    // pour récupèrer l'id, sinon il n'envoi pas l'id
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    quantity: DataTypes.INTEGER,
    unit_net_price: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
}, {
    sequelize: connection,
    tableName: "order_has_article"
})

module.exports = OrderHasArticle;