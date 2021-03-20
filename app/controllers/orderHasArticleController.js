const { Article, Category, Size, User, Order, Address, ArticleHasSize, OrderHasArticle } = require('../models/index');
const sequelize = require('../database');

const orderHasArticleController = {

    // get all the links between an order and its articles and that for all orders
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await OrderHasArticle.findAll();
        res.json(response);
    },

    // get all the links between an order and its articles
    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await OrderHasArticle.findOne({
            where: {
                id,
            }
        });
        res.json(response);
    },

    // we add one or more articles to an order
    create: async (order_id, data) => {

        console.log('data.articles: ', data.articles)
        console.log('data.articles.length: ', data.articles.length)
        console.log(Array.isArray(data.articles));

        // for each article
        [...data.articles].forEach(async (article) => {

            // we get its size
            const searchSizeId = await Size.findOne({
                where: {
                    size_name: article.sizes.size,
                }
            });

            const sizeId = searchSizeId.dataValues.id;

            // we add a new article in our order with its size
            // if there is another size and we will go back through the loop and start over
            await OrderHasArticle.create({
                article_id: article.article_id,
                size_id: sizeId,
                quantity: article.sizes.quantity,
                unit_net_price: article.unit_net_price,
                order_id: order_id
            });
        })
    }

};

module.exports = orderHasArticleController;