const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        underscored: true,// automatically match camelCase <-> snake_case, if we don't write it, sequelize expects a createdAt column while the column is named created_at
        timestamps: false
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
module.exports = sequelize;