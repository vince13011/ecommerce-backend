const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class Order extends Model { };

Order.init({
    order_number: DataTypes.INTEGER,
    total_price: DataTypes.TEXT,
    // status_id: {
    //     type: DataTypes.INTEGER,
    // },
    tracking_number: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
}, {
    sequelize: connection,
    tableName: "order"
});

module.exports = Order;