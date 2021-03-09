const { Article, Category, Size, User, Order, Address } = require('../models/index');

const OrderController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const orders = await Order.findAll({
            attributes: {
                exclude: ['created_at', 'updated_at']
            },
            include: ['order_has_address'],
            limit,
            order: [
                ['created_at', 'ASC']
            ]
        });
        res.json(orders);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const order = await Order.findOne({
            where: {
                id,
            },
            include: ['order_has_address']
        });
        res.json(order);
    },
};

module.exports = OrderController;
