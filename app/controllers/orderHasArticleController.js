const { Article, Category, Size, User, Order, Address, ArticleHasSize, OrderHasArticle } = require('../models/index');
const sequelize = require('../database');

const orderHasArticleController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await OrderHasArticle.findAll();
        res.json(response);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await OrderHasArticle.findOne({
            where: {
                id,
            }
        });
        res.json(response);
    },


    create: async (order_id, data) => {
        console.log(order_id, data);

        // je boucle sur les data que je vais récupérer dans le orderController
        data.forEach(async (article) => {
            // là, on donne des valeurs aux champs nécessaires de cette table
            await OrderHasArticle.create({
                article_id: article.article_id,
                quantity: article.quantity,
                unit_net_price: article.unit_net_price,
                order_id: order_id
            });
        })
    },

};

module.exports = orderHasArticleController;