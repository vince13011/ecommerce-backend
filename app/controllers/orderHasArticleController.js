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

        console.log('data.articles: ', data.articles)
        console.log('data.articles.length: ', data.articles.length)
        console.log(Array.isArray(data.articles))

        for(article of data.articles){
            (async (article) => {
                const searchSizeId = await Size.findOne({
                    where: {
                        size_name: article.sizes.size,
                    }
                });
                const sizeId = searchSizeId.dataValues.id;
                await OrderHasArticle.create({
                    article_id: article.article_id,
                    size_id: sizeId,
                    quantity: article.sizes.quantity,
                    unit_net_price: article.unit_net_price,
                    order_id: order_id
                });
            }
            )}
    },

};

module.exports = orderHasArticleController;