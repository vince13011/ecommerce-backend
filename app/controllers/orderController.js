
const { Article, Category, Size, User, Order, Address, ArticleHasSize, Status } = require('../models/index');
const orderHasArticleController = require('./orderHasArticleController');
const jwtUtils = require('../services/jwt.utils');

const OrderController = {

    //retourne toutes les commandes avec le statut de traitement, les articles qu'elles contiennent et la quantité des articles avec leurs sizes
    getAll: async (req, res) => {
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
        const searchSize = await Size.findAll();
        const searchArticle = await Article.findAll();
        // 1) je déclare un tableau vide qui sera PUSH au fur et à mesure et sera renvoyé à la fin en res.JSON
        const reponseOrders = [];

        // 2) on boucle sur TOUTES LES ORDERS que nous avons récupérés grace à la méthode findAll au dessus (ligne 16)
        [...orders].forEach((orderElement) => {

            // pour chaque orderElement => les données, se trouvent DANS orderElement.dataValues
            // c'est pour cette raison, qu'on RENOMME orderElement.dataValues = order
            const order = orderElement.dataValues;
            // 3) on déclare un tableau vide d'address qui sera push à chaque passage de boucle / requete
            let adressResponse = [];
            // 4) on push dans addressResponse les informations SUIVANTES
            adressResponse.push({
                address_id: order.order_has_address.id,
                city: order.order_has_address.city,
                zip_code: order.order_has_address.zip_code,
                number: order.order_has_address.number,
                street_name: order.order_has_address.street_name,
                additional: order.order_has_address.additional
            });
            // la même chose que pour le tebleau address mais pour les articles
            let articleResponse = [];

            orderElement.orderArticles.forEach((article) => {
              
                let size_name = '';

                // j'ai dans la const searchSize TOUTES les sizes, et je boucle sur TOUTES les sizes pour trouver la size qui correspond
                // on cherche SEULEMENT les sizes qui sont dans order_has_article.size_id
                [...searchSize].forEach((size) => {
                   
                    // pour chacune des sizes, si elle est égale à article.order_has_article.size_id je donne sa valeur à size_name ci dessus 
                    if (size.id === article.order_has_article.size_id) {
                        size_name = size.size_name;
                    }
                });
               // je parcours tous les articles et je cherche l'id qui correspond à l'id de l'article qu'on a dans le order
                // du coup let image = à ce qu'on a trouvé 
                let image = '';
                [...searchArticle].forEach((art) => {

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
       
    //retourne une commande avec le statut de traitement, les articles qu'elle contient et la quantité des articles
    getOne: async (req, res, next) => {
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
        console.log('orderElement oooooooooooooà:',orderElement);
         if (!orderElement) {
            res.status(400).json(`pas d'order avec l'id ${id}`);
            next();
         }

        const searchSize = await Size.findAll();
        const searchArticle = await Article.findAll();

          // je déclare un tableau vide qui sera PUSH au fur et à mesure et sera renvoyé à la fin en res.JSON
        const reponseOrders = [];
         const order = orderElement.dataValues;
        
        // on déclare un tableau vide d'address qui sera push à chaque passage de boucle / requete
        let adressResponse = [];
       
        //  on push dans addressResponse les informations SUIVANTES
        adressResponse.push({
            address_id: order.order_has_address.id,
            city: order.order_has_address.city,
            zip_code: order.order_has_address.zip_code,
            number: order.order_has_address.number,
            street_name: order.order_has_address.street_name,
            additional: order.order_has_address.additional
        });

        // la même chose que pour le tebleau address mais pour les articles
        let articleResponse = [];

        orderElement.orderArticles.forEach(async (article) => {

            let size_name = '';

             // j'ai dans la const searchSize TOUTES les sizes, et je boucle sur TOUTES les sizes pour trouver la size qui correspond
            // on cherche SEULEMENT les sizes qui sont dans order_has_article.size_id
            searchSize.forEach((size) => {
                if (size.id === article.order_has_article.size_id) {
                    size_name = size.size_name;
                }
            });

            // je parcours tous les articles et je cherche l'id qui correspond à l'id de l'article qu'on a dans le order
            // du coup let image = à ce qu'on a trouvé 
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
       if (orderElement[-1]) {
            res.status(400).json(`pas d'order avec l'id ${id}`)
        }

        res.json(reponseOrders);
    },

    create: async (req, res) => {
        const data = req.body;

        //on crée un numéro de commande
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

        // create juste un order avec les donnes du body
        const order = await Order.create({
            ...data,
        });
        // recupération du id
        const orderID = order.id;
        // renvoie vers le create de orderHasArticleController avec deux arguments orderID et data.articles
        await orderHasArticleController.create(orderID, data);

        //pour chaque article on récupere da quantité dans la commande et on met le stock à jour
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
        const orders = searchOrders;

        // 1) je déclare un tableau vide qui sera PUSH au fur et à mesure et sera renvoyé à la fin en res.JSON
        const reponseOrders = [];

         // 2) on boucle sur TOUTES LES ORDERS que nous avons récupérés grace à la méthode findAll au dessus (ligne 16)
        orders.forEach(async (orderElement) => {

             // pour chaque orderElement => les données, se trouvent DANS orderElement.dataValues
            // c'est pour cette raison, qu'on RENOMME orderElement.dataValues = order
            const order = orderElement.dataValues;
             // 3) on déclare un tableau vide d'address qui sera push à chaque passage de boucle / requete
            let adressResponse = [];
            // 4) on push dans addressResponse les informations SUIVANTES
            adressResponse.push({
                address_id: order.order_has_address.id,
                city: order.order_has_address.city,
                zip_code: order.order_has_address.zip_code,
                number: order.order_has_address.number,
                street_name: order.order_has_address.street_name,
                additional: order.order_has_address.additional
            });
            // la même chose que pour le tebleau address mais pour les articles
            let articleResponse = [];

            orderElement.orderArticles.forEach(async (article) => {

                let size_name = '';
                // j'ai dans la const searchSize TOUTES les sizes, et je boucle sur TOUTES les sizes pour trouver la size qui correspond
                // on cherche SEULEMENT les sizes qui sont dans order_has_article.size_id
                searchSize.forEach((size) => {

                    // pour chacune des sizes, si elle est égale à article.order_has_article.size_id je donne sa valeur à size_name ci dessus 
                    if (size.id === article.order_has_article.size_id) {
                        size_name = size.size_name;
                    }
                });

               // je parcours tous les articles et je cherche l'id qui correspond à l'id de l'article qu'on a dans le order
               // du coup let image = à ce qu'on a trouvé 
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

    //on met à jour le statut d'une commande
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