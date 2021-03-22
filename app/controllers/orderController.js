
const { Article, Category, Size, User, Order, Address, ArticleHasSize, Status, OrderHasArticle } = require('../models/index');
const orderHasArticleController = require('./orderHasArticleController');
const jwtUtils = require('../services/jwt.utils');

const OrderController = {


    // return all the orders with the processing status, the articles they contain and the quantity of the articles with their sizes
    getAll: async (req, res, next) => {
        const { limit } = req.query;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);
        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }

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

        // if there is no order
        if (!orders) {
            res.status(400).json(`Il n'y a aucune commande`);
            next();
        }

        const searchSize = await Size.findAll();
        const searchArticle = await Article.findAll();
        const searchOrderArticle = await OrderHasArticle.findAll();
        // 1) I declare an empty array which will be PUSH as I go and will be returned at the end in res.JSON
        const reponseOrders = [];

        // 2) we loop through ALL THE ORDERS that we have retrieved using the findAll method above (line 16)
        [...orders].forEach((orderElement) => {

            // for each orderElement => the data, is in orderElement.dataValues
            // this is why we rename orderElement.dataValues ​​= order
            const order = orderElement.dataValues;
            // 3) we declare an empty array of address which will be pushed each time a loop / request is passed
            let adressResponse = [];
            // 4) we push in addressResponse the following information
            adressResponse.push({
                address_id: order.order_has_address.id,
                city: order.order_has_address.city,
                zip_code: order.order_has_address.zip_code,
                number: order.order_has_address.number,
                street_name: order.order_has_address.street_name,
                additional: order.order_has_address.additional
            });
            // the same as for the tebleau address but for the articles
            let articleResponse = [];

            // orderElement.orderArticles.forEach((article) => {

            //     let size_name = '';

            //     // I have in the const searchSize all the sizes, and I loop through all the sizes to find the corresponding size
            //     // we only look for the sizes that are in order_has_article.size_id
            //     [...searchSize].forEach((size) => {


            //         // for each of the sizes, if it is equal to article.order_has_article.size_id I give its value to size_name above
            //         if (size.id === article.order_has_article.size_id) {
            //             size_name = size.size_name;
            //         }
            //     });

            //     // I browse all the articles and I look for the id which corresponds to the id of the article we have in the order
            //     // so let image = what we found
            //     let image = '';
            //     [...searchArticle].forEach((art) => {

            //         if (art.id === article.order_has_article.article_id) {
            //             image = art.dataValues.image;
            //         }
            //     });
            //     articleResponse.push({
            //         article_id: article.order_has_article.article_id,
            //         article_image: image,
            //         unit_net_price: article.order_has_article.unit_net_price,
            //         sizes: {
            //             size: size_name,
            //             quantity: article.order_has_article.quantity
            //         }
            //     });
            // })
            [...searchOrderArticle].forEach((element) => {
                if (element.dataValues.order_id === order.id) {
                    let size_name = '';
                    searchSize.forEach((size) => {
                        if (size.id === element.dataValues.size_id) {
                            size_name = size.size_name;
                        }
                    });
                    let image = '';
                    searchArticle.forEach((art) => {
                        if (art.id === element.dataValues.article_id) {
                            image = art.dataValues.image;
                        }
                    });
                    articleResponse.push({
                        article_id: element.dataValues.article_id,
                        article_image: image,
                        unit_net_price: element.dataValues.unit_net_price,
                        sizes: {
                            size: size_name,
                            quantity: element.dataValues.quantity
                        }
                    });
                }
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

    // return an order with the processing status, the articles it contains and the quantity of the articles
    // getOne: async (req, res, next) => {
    //     const { id } = req.params;
    //     const orderElement = await Order.findOne({
    //         include: [
    //             {
    //                 association: 'orderArticles',
    //             },
    //             {
    //                 association: 'order_has_status',
    //             },
    //             {
    //                 association: 'order_has_address',
    //                 attributes:
    //                     [
    //                         'id', 'user_id',
    //                         'country', 'city',
    //                         'zip_code', 'number',
    //                         'street_name', 'additional'
    //                     ],
    //             },
    //         ],
    //         order: [
    //             ['updated_at', 'DESC']
    //         ],
    //         where: {
    //             id,
    //         }
    //     });
    //     console.log('orderElement oooooooooooooà:', orderElement);
    //     if (!orderElement) {
    //         res.status(400).json(`pas d'order avec l'id ${id}`);
    //         next();
    //     }

    //     const searchSize = await Size.findAll();
    //     const searchArticle = await Article.findAll();

    //     // I declare an empty array which will be PUSH as I go along and will be returned at the end in res.JSON
    //     const reponseOrders = [];
    //     const order = orderElement.dataValues;

    //     // we declare an empty array of address which will be pushed each time a loop / request is passed
    //     let adressResponse = [];

    //     // we push in addressResponse the FOLLOWING information
    //     adressResponse.push({
    //         address_id: order.order_has_address.id,
    //         city: order.order_has_address.city,
    //         zip_code: order.order_has_address.zip_code,
    //         number: order.order_has_address.number,
    //         street_name: order.order_has_address.street_name,
    //         additional: order.order_has_address.additional
    //     });

    //     // the same as for the array of address but for the articles       
    //     let articleResponse = [];
    //     orderElement.orderArticles.forEach(async (article) => {

    //         let size_name = '';

    //         // I have in the const searchSize ALL the sizes, and I loop through ALL the sizes to find the corresponding size
    //         // we ONLY look for the sizes that are in order_has_article.size_id
    //         searchSize.forEach((size) => {
    //             if (size.id === article.order_has_article.size_id) {
    //                 size_name = size.size_name;
    //             }
    //         });


    //         // I browse all the articles and I look for the id which corresponds to the id of the article we have in the order
    //         // so let image = what we found
    //         let image = '';
    //         searchArticle.forEach((art) => {
    //             if (art.id === article.order_has_article.article_id) {
    //                 image = art.dataValues.image;
    //             }
    //         });
    //         articleResponse.push({
    //             article_id: article.order_has_article.article_id,
    //             article_image: image,
    //             unit_net_price: article.order_has_article.unit_net_price,
    //             sizes: {
    //                 size: size_name,
    //                 quantity: article.order_has_article.quantity
    //             }
    //         });
    //     })
    //     let objetOrder = {
    //         id: order.id,
    //         order_number: order.order_number,
    //         status_name: order.order_has_status.status_name,
    //         tracking_number: order.tracking_number,
    //         total_price: order.total_price,
    //         created_at: order.created_at,
    //         updated_at: order.updated_at,
    //         address: adressResponse,
    //         user_id: order.order_has_address.dataValues.user_id,
    //         articles: articleResponse
    //     };
    //     reponseOrders.push(objetOrder);
    //     if (orderElement[-1]) {
    //         res.status(400).json(`pas d'order avec l'id ${id}`)
    //     }

    //     res.json(reponseOrders);
    // },
    getOne: async (req, res) => {
        const { id } = req.params;
        const orderElement = await Order.findOne({
            include: [
                {
                    association: 'orderArticles',
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
        // on va dans la table orderHasArticle, chercher toutes les commandes avec un
        // order_id égal à id
        const searchOrderArticle = await OrderHasArticle.findAll({
            where: {
                order_id: id,
            }
        });
        // on boucle sur les commandes retournées
        [...searchOrderArticle].forEach((element) => {
            let size_name = '';
            searchSize.forEach((size) => {
                if (size.id === element.dataValues.size_id) {
                    size_name = size.size_name;
                }
            });
            let image = '';
            searchArticle.forEach((art) => {
                if (art.id === element.dataValues.article_id) {
                    image = art.dataValues.image;
                }
            });
            articleResponse.push({
                article_id: element.dataValues.article_id,
                article_image: image,
                unit_net_price: element.dataValues.unit_net_price,
                sizes: {
                    size: size_name,
                    quantity: element.dataValues.quantity
                }
            });
        })
        /*         orderElement.orderArticles.forEach(async (article) =>{
                    let size_name = '';
                    searchSize.forEach((size) => {
                        if(size.id === article.order_has_article.size_id){
                            size_name = size.size_name;
                        }
                    });
                    let image = '';
                    searchArticle.forEach((art) =>{
                        if(art.id === article.order_has_article.article_id){
                            image = art.dataValues.image;
                        }
                    });
                    articleResponse.push({
                        article_id : article.order_has_article.article_id,
                        article_image : image,
                        unit_net_price : article.order_has_article.unit_net_price,
                        sizes : {
                            size : size_name,
                            quantity : article.order_has_article.quantity
                        }
                    });
                }) */
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

    //creation of an order
    create: async (req, res) => {
        const data = req.body;


        // we create an order number
        const order_number = `UI${data.user_id}AI${data.address_id}TP${data.total_price}DN` + Date.now();
        data.order_number = order_number;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0) {
            let userId = jwtUtils.getAdminId(headerAuth);
            if (userId < 0) {
                return res.status(400).json({ 'error': 'token absent' });
            }
        }

        // create an order with the data of the body
        const order = await Order.create({
            ...data,
        });
        // recovery of id
        const orderID = order.id;
        // returns to the create of orderHasArticleController with two arguments orderID and data.articles
        await orderHasArticleController.create(orderID, data);

        // for each item we get a quantity in the order and we update the stock
        [...data.articles].forEach(async (article) => {

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
        if (!order) {
            res.status(400).json(`La création de l'order a échoué`)
        }

        res.json(order);
    },



    // return the command of an user and its content
    userOrders: async (req, res) => {
        const { id } = req.params;
        const { limit } = req.query;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0) {
            let userId = jwtUtils.getAdminId(headerAuth);
            if (userId < 0) {
                return res.status(400).json({ 'error': 'token absent' });
            }
        }

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
        const searchOrderArticle = await OrderHasArticle.findAll();
        const orders = searchOrders;
        // 1) I declare an empty array which will be PUSH as I go and will be returned at the end in res.JSON
        const reponseOrders = [];

        // 2) we loop through ALL THE ORDERS that we have retrieved using the findAll method above (line 16)
        orders.forEach(async (orderElement) => {


            // for each orderElement => the data, is IN orderElement.dataValues
            // this is why we RENAME orderElement.dataValues ​​= order
            const order = orderElement.dataValues;
            // 3) we declare an empty array of address which will be pushed each time a loop / request is passed
            let adressResponse = [];
            // 4) we push in addressResponse the FOLLOWING information
            adressResponse.push({
                address_id: order.order_has_address.id,
                city: order.order_has_address.city,
                zip_code: order.order_has_address.zip_code,
                number: order.order_has_address.number,
                street_name: order.order_has_address.street_name,
                additional: order.order_has_address.additional
            });

            // the same as for the address array but for the articles
            let articleResponse = [];

            // orderElement.orderArticles.forEach(async (article) => {

            //     let size_name = '';
            //     // I have in the const searchSize all the sizes, and I loop through ALL the sizes to find the corresponding size
            //     // we only look for the sizes that are in order_has_article.size_id
            //     searchSize.forEach((size) => {

            //         // for each of the sizes, if it is equal to article.order_has_article.size_id I give its value to size_name above
            //         if (size.id === article.order_has_article.size_id) {
            //             size_name = size.size_name;
            //         }
            //     });

            //     // I browse all the articles and I look for the id which corresponds to the id of the article we have in the order
            //     // so let image = what we found
            //     let image = '';
            //     searchArticle.forEach((art) => {
            //         if (art.id === article.order_has_article.article_id) {
            //             image = art.dataValues.image;
            //         }
            //     });
            //     articleResponse.push({
            //         article_id: article.order_has_article.article_id,
            //         article_image: image,
            //         unit_net_price: article.order_has_article.unit_net_price,
            //         sizes: {
            //             size: size_name,
            //             quantity: article.order_has_article.quantity
            //         }
            //     });
            // })
            [...searchOrderArticle].forEach((element) => {
                if (element.dataValues.order_id === order.id) {
                    let size_name = '';
                    searchSize.forEach((size) => {
                        if (size.id === element.dataValues.size_id) {
                            size_name = size.size_name;
                        }
                    });
                    let image = '';
                    searchArticle.forEach((art) => {
                        if (art.id === element.dataValues.article_id) {
                            image = art.dataValues.image;
                        }
                    });
                    articleResponse.push({
                        article_id: element.dataValues.article_id,
                        article_image: image,
                        unit_net_price: element.dataValues.unit_net_price,
                        sizes: {
                            size: size_name,
                            quantity: element.dataValues.quantity
                        }
                    });
                }
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

    // we update the status of an order 
    update: async (req, res) => {
        const data = req.body;
        const { id } = req.params;

        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }


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