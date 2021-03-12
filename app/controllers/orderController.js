const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
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
                    include: [{
                        association: 'sizes',
                    }],
                    attributes: {
                        exclude: [
                            'reference', 'name',
                            'description',
                            'color', 'pre_tax_price',
                            'vat_rate', 'discount',
                            'created_at', 'updated_at'
                        ]
                    }
                }
            ],
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
                    include: ['sizes'],
                    attributes: {
                        exclude: [
                            'reference', 'name',
                            'description',
                            'color', 'pre_tax_price',
                            'vat_rate', 'discount',
                            'created_at', 'updated_at'
                        ]
                    }
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
        const order_number = `UI${data.user_id}AI${data.address_id}TP${data.total_price}DN` + Date.now();
        data.order_number = order_number;
        // create juste un order avec les donnes du body
        const order = await Order.create({
            ...data,
        });
        // recupération du id
        const orderID = order.id;
        // renvoie vers le create de orderorderHasArticleController avec deux arguments orderID et data.articles
        orderHasArticleController.create(orderID, data);

        data.articles.forEach(async (article) => {
            const searchSizeId = await Size.findOne({
                where: {
                    size_name: article.sizes.size,
                }
            });
            const sizeId = searchSizeId.dataValues.id;
            const searchOldStock = await ArticleHasSize.findOne({
                where: {
                    article_id: article.article_id,
                    size_id: sizeId,
                }
            });
            const oldStock = searchOldStock.stock;
            await ArticleHasSize.update({
                stock: Number(oldStock - article.sizes.quantity),
            }, {
                where: {
                    article_id: article.article_id,
                    size_id: sizeId,
                }
            })
        });

        res.json(order);
    },

    userOrders: async (req, res) => {
        const { id } = req.params;
        const order = await Order.findOne({
            include: [
                {
                    association: 'order_has_address',
                    attributes: ['user_id'],
                    where: {
                        user_id: id,
                    }
                },
                {
                    association: 'orderArticles',
                    include: ['sizes'],
                    attributes: {
                        exclude: [
                            'reference', 'name',
                            'description',
                            'color', 'pre_tax_price',
                            'vat_rate', 'discount',
                            'created_at', 'updated_at'
                        ]
                    }
                }],
            order: [
                ['created_at', 'ASC']
            ],
        });

        res.json(order);
    }
};

module.exports = OrderController;
