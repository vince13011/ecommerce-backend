const { response } = require('express');
const { Article, Category, Size, User, Order, Address, ArticleHasSize, Status } = require('../models/index');
const orderHasArticleController = require('./orderHasArticleController');
const OrderController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const orders = await Order.findAll({
            include: [{
                association: 'orderArticles',
            },
            {
                association: 'order_has_status',
            },
            {
                association: 'order_has_address',
                attributes:
                    [
                        'id', 'user_id',
                        'country', 'city',
                        'zip_code', 'number',
                        'street_name', 'additional'
                    ],
            },

            ],
            limit,
            order: [
                ['created_at', 'DESC']
            ]
        });
        // res.json(searchOrders);

        const searchSize = await Size.findAll();
        const searchArticle = await Article.findAll();
        const reponseOrders = [];
        orders.forEach((orderElement) => {
            const order = orderElement.dataValues;
            let adressResponse = [];
            adressResponse.push({
                address_id: order.order_has_address.id,
                city: order.order_has_address.city,
                zip_code: order.order_has_address.zip_code,
                number: order.order_has_address.number,
                street_name: order.order_has_address.street_name,
                additional: order.order_has_address.additional
            });
            let articleResponse = [];
            orderElement.orderArticles.forEach((article) => {
                let size_name = '';
                searchSize.forEach((size) => {
                    if (size.id === article.order_has_article.size_id) {
                        size_name = size.size_name;
                    }
                });
                // je prends une image vide, je parcours tous les articles, 
                // et je cherche l'id qui correspond à l'id de l'article qu'on a 
                // dans le order
                // du coup cette image = à ce qu'a été trouvé . image
                let image = '';
                searchArticle.forEach((art) => {
                    if (art.id === article.order_has_article.article_id) {
                        image = art.dataValues.image;
                    }
                });
                articleResponse.push({
                    article_id: article.order_has_article.article_id,
                    article_image: image,
                    unit_net_price: article.order_has_article.unit_net_price,
                    sizes: {
                        size: size_name,
                        quantity: article.order_has_article.quantity
                    }
                });
            })
            let objetOrder = {
                id: order.id,
                order_number: order.order_number,
                status_name: order.order_has_status.status_name,
                tracking_number: order.tracking_number,
                total_price: order.total_price,
                created_at: order.created_at,
                updated_at: order.updated_at,
                address: adressResponse,
                user_id: order.order_has_address.dataValues.user_id,
                articles: articleResponse
            };
            reponseOrders.push(objetOrder);
        });
        res.json(reponseOrders);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const orderElement = await Order.findOne({
            include: [
                {
                    association: 'orderArticles',
                },
                {
                    association: 'order_has_status',
                },
                {
                    association: 'order_has_address',
                    attributes:
                        [
                            'id', 'user_id',
                            'country', 'city',
                            'zip_code', 'number',
                            'street_name', 'additional'
                        ],
                },
            ],
            order: [
                ['updated_at', 'DESC']
            ],
            where: {
                id,
            }
        });
        const searchSize = await Size.findAll();
        const searchArticle = await Article.findAll();
        const reponseOrders = [];
        const order = orderElement.dataValues;
        let adressResponse = [];
        adressResponse.push({
            address_id: order.order_has_address.id,
            city: order.order_has_address.city,
            zip_code: order.order_has_address.zip_code,
            number: order.order_has_address.number,
            street_name: order.order_has_address.street_name,
            additional: order.order_has_address.additional
        });
        let articleResponse = [];
        orderElement.orderArticles.forEach(async (article) => {
            let size_name = '';
            searchSize.forEach((size) => {
                if (size.id === article.order_has_article.size_id) {
                    size_name = size.size_name;
                }
            });
            // je prends une image vide, je parcours tous les articles, 
            // et je cherche l'id qui correspond à l'id de l'article qu'on a 
            // dans le order
            // du coup cette image = à ce qu'a été trouvé . image
            let image = '';
            searchArticle.forEach((art) => {
                if (art.id === article.order_has_article.article_id) {
                    image = art.dataValues.image;
                }
            });
            articleResponse.push({
                article_id: article.order_has_article.article_id,
                article_image: image,
                unit_net_price: article.order_has_article.unit_net_price,
                sizes: {
                    size: size_name,
                    quantity: article.order_has_article.quantity
                }
            });
        })
        let objetOrder = {
            id: order.id,
            order_number: order.order_number,
            status_name: order.order_has_status.status_name,
            tracking_number: order.tracking_number,
            total_price: order.total_price,
            created_at: order.created_at,
            updated_at: order.updated_at,
            address: adressResponse,
            user_id: order.order_has_address.dataValues.user_id,
            articles: articleResponse
        };
        reponseOrders.push(objetOrder);

        res.json(reponseOrders);
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
        const { limit } = req.query;
        const searchOrders = await Order.findAll({
            include: [{
                association: 'orderArticles',
            },
            {
                association: 'order_has_status',
            },
            {
                association: 'order_has_address',
                attributes:
                    [
                        'id', 'user_id',
                        'country', 'city',
                        'zip_code', 'number',
                        'street_name', 'additional'
                    ],
                where: {
                    user_id: id,
                }
            },

            ],
            limit,
            order: [
                ['created_at', 'DESC']
            ]
        });
        const searchSize = await Size.findAll();
        const searchArticle = await Article.findAll();
        const orders = searchOrders;
        const reponseOrders = [];
        orders.forEach(async (orderElement) => {
            const order = orderElement.dataValues;
            let adressResponse = [];
            adressResponse.push({
                address_id: order.order_has_address.id,
                city: order.order_has_address.city,
                zip_code: order.order_has_address.zip_code,
                number: order.order_has_address.number,
                street_name: order.order_has_address.street_name,
                additional: order.order_has_address.additional
            });
            let articleResponse = [];
            orderElement.orderArticles.forEach(async (article) => {
                let size_name = '';
                searchSize.forEach((size) => {
                    if (size.id === article.order_has_article.size_id) {
                        size_name = size.size_name;
                    }
                });
                // je prends une image vide, je parcours tous les articles, 
                // et je cherche l'id qui correspond à l'id de l'article qu'on a 
                // dans le order
                // du coup cette image = à ce qu'a été trouvé . image
                let image = '';
                searchArticle.forEach((art) => {
                    if (art.id === article.order_has_article.article_id) {
                        image = art.dataValues.image;
                    }
                });
                articleResponse.push({
                    article_id: article.order_has_article.article_id,
                    article_image: image,
                    unit_net_price: article.order_has_article.unit_net_price,
                    sizes: {
                        size: size_name,
                        quantity: article.order_has_article.quantity
                    }
                });
            })
            let objetOrder = {
                id: order.id,
                order_number: order.order_number,
                status_name: order.order_has_status.status_name,
                tracking_number: order.tracking_number,
                total_price: order.total_price,
                created_at: order.created_at,
                updated_at: order.updated_at,
                address: adressResponse,
                user_id: order.order_has_address.dataValues.user_id,
                articles: articleResponse
            };
            reponseOrders.push(objetOrder);
        });
        res.json(reponseOrders);
    },

    update: async (req, res) => {
        const data = req.body;
        const { id } = req.params;
        /*
            {
                "status_name": "sent",
                "tracking_number": '12OOE03991030'
            }
        */
        const findStatusId = await Status.findOne({
            where: {
                status_name: data.status_name,
            }
        });

        const statusId = findStatusId.dataValues.id;
        const order = await Order.update({
            tracking_number: data.tracking_number,
            status_id: statusId,
        }, {
            where: {
                id: id,
            }
        });
        res.json(`l'order ${id} a bien été modifié, le nouveau status de la commande est : ${data.status_name}`)
    },
};

module.exports = OrderController;