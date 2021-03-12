const { Article, Category, Size, User, Order, Address } = require('../models/index');
const orderHasArticleController = require('./orderHasArticleController');
const OrderController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const orders = await Order.findAll({
            attributes: {
                exclude: ['created_at', 'updated_at']
            },
            include: [
                {
                    association: 'order_has_address',
                    attributes: ['user_id']
                },
                {
                    association: 'orderArticles',
                    attributes: { exclude: ['id', 'description', 'image', 'color', 'pre_tax_price', 'vat_rate', 'discount', 'created_at', 'updated_at'] }
                }],
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
            attributes: {
                exclude: ['created_at', 'updated_at']
            },
            include: [
                {
                    association: 'order_has_address',
                    attributes: ['user_id']
                },
                {
                    association: 'orderArticles',
                    attributes: { exclude: ['id', 'description', 'image', 'color', 'pre_tax_price', 'vat_rate', 'discount', 'created_at', 'updated_at'] }
                }],
            order: [
                ['created_at', 'ASC']
            ],
            where: {
                id,
            }
        });
        res.json(order);
    },

    create: async (req, res) => {
        const data = req.body;
        /* let order_number = `479${data.user_id}${data.address_id}${data.total_price}` + Date.now();
        order_number = Number(order_number) */
        const order_number = '5646';
        data.order_number = order_number;
        // create juste un order avec les donnes du body
        const order = await Order.create({
            ...data,
        });
        // recupération du id
        const orderID = order.id;
        // renvoie vers le create de orderorderHasArticleController avec deux arguments orderID et data.articles
        orderHasArticleController.create(orderID, data.articles)

        res.json(order);
    }
};

module.exports = OrderController;
