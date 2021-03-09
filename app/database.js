const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        underscored: true, // faire correspondre automatiquement camelCase <-> snake_case, si on ne l'écrit pas, sequelize attend une colonne createdAt alors que la colonne se nomme created_at
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