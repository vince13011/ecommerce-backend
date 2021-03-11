
    const { response } = require('express');
const { associations } = require('../models/Article');
const { OrderHasArticle, Article, Category, Size, User, Order, Address } = require('../models/index');

    const OrderController = {
        getAll: async (req, res) => {
            const { limit } = req.query;
            const orderHasArticle = await Order.findAll({
                attributes: {
                    exclude: ['created_at', 'updated_at']
                },
                include:[{
                    association:'orderArticles',
                    attributes: {
                        exclude: ['id','','created_at', 'updated_at']
                    },
                    order: [
                        ['updated_at', 'ASC']
                    ]
                }]
            });
            res.json(orderHasArticle);
        },

    getOne: async (req, res) => {
        const { id } = req.params;
        const { limit } = req.query;
            const orderHasArticle = await Order.findOne({
                where:{id},
                attributes: {
                    exclude: ['created_at', 'updated_at']
                },
                include:[{
                    association:'orderArticles',
                    attributes: {
                        exclude: ['id','','created_at', 'updated_at']
                    },
                    order: [
                        ['updated_at', 'ASC']
                    ]
                }]
            });
            res.json(orderHasArticle);
    },

    create: async (req, res) => {
        
        // ce qui va servir pour faire le nouvel order
        const order = {
            order_number:req.body.orderNumber,
            total_price:req.body.totalPrice,
            address_id:req.body.addressId
        }
        // on cherche si un order avec ce numéro de commande existe déja
        const searchOrder = await Order.findOne({ where:{order_number:order.order_number} });
        console.log('ceci est le resultat de searchOrder', searchOrder);
        
        // s'il existe, on exécute ce code
        if (searchOrder) {
        // on prépare le nouvel order has article avec le numéro de commande existant
        const orderArticles = {
                order_id : searchOrder.id,
                article_id : req.body.articleId,
                quantity: req.body.quantity,
                unit_net_price: req.body.unitNetPrice
            }
      
            // on met à jour le prix total qui en req.body
           const updateOrder = await Order.update(
                                {total_price : req.body.totalPrice},
                                {where:{id : searchOrder.id}}
                             )
            // on récupère ses info avec un findOne                 
            const infoOrder = await Order.findOne({ where:{order_number:order.order_number} });
            
            //on insert notre nouvel orderHasArticle
            await OrderHasArticle.create(orderArticles);

            //on récupère ses infos
            const infoOrderArticles= await OrderHasArticle.findAll({where:{order_id : searchOrder.id},
                                                                    attributes:{exclude: ['created_at','updated_at']}
                                                                    });
            //on mets les infos d'un order et les infos de orderHasArticle dans un tableau
            //que l'on retourne                                                       
            const allInfoOrder= [infoOrder,infoOrderArticles];
            res.json(allInfoOrder)
        }

        //si l'order n'existe pas on exécute ce code
        else{ 
            console.log('order : ',order);
            
            // on créé un nouvel order avec l'objet order créé au début de la méthode.
            await Order.create(order);

            //on récupère les info de l'order que l'on vient de créer
            const infoOrder = await Order.findOne({where:{order_number:order.order_number}});
            console.log('infoOrder: ',infoOrder);
            
            // on prépare le nouvel order has article avec le numéro de commande existant
            const orderArticles = {
                order_id : infoOrder.id,
                article_id : req.body.articleId,
                quantity: req.body.quantity,
                unit_net_price: req.body.unitNetPrice
            }

            // on créer le nouvel orderHasArticle qui est pour l'instant le seul de la liste
            await OrderHasArticle.create(orderArticles);

            //on récupère ses infos
            const infoOrderArticles= await OrderHasArticle.findAll({where:{order_id : infoOrder.id},
                                                                    attributes: {
                                                                        exclude: ['created_at','updated_at']
                                                                    }

                                                                    });
            //on mets les infos du nouvel order et les infos de son premier orderHasArticle
            //dans un tableau que l'on retourne  
            const allInfoOrder= [infoOrder,infoOrderArticles];
            res.json(allInfoOrder)
        
    }
    }

};

module.exports = OrderController;
