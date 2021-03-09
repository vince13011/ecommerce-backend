const { DataTypes, Model } = require('sequelize');
const connection = require('../database');

class Address extends Model { };

Address.init({
    country: {
        type: DataTypes.TEXT,
        defaultValue: 'France'
    },
    city: DataTypes.TEXT,
    zip_code: DataTypes.INTEGER,
    number: DataTypes.TEXT,
    street_name: DataTypes.TEXT,
    additional: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
}, {
    sequelize: connection,
    tableName: "address"
});

module.exports = Address;