const { Article, Category, Size, User, Order, Address, ArticleHasSize, OrderHasArticle } = require('../models/index');
const sequelize = require('../database');

const orderHasArticleController = {

    //récupère tout les liens entre un order et ses articles  et çela pour tout les orders
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await OrderHasArticle.findAll();
        res.json(response);
    },

    //récupère tout les liens entre un order et ses articles
    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await OrderHasArticle.findOne({
            where: {
                id,
            }
        });
        res.json(response);
    },

    //on ajoute un ou des articles à un order
    create: async (order_id, data) => {

        console.log('data.articles: ', data.articles)
        console.log('data.articles.length: ', data.articles.length)
        console.log(Array.isArray(data.articles));

        //pour chaque article
        [...data.articles].forEach(async (article) => {

            //on récupère sa size
            const searchSizeId = await Size.findOne({
                where: {
                    size_name: article.sizes.size,
                }
            });

            const sizeId = searchSizeId.dataValues.id;

            // on ajoute un nouvel article dans notre order avec sa taille
            // s'il y a un autre taille et on repassera dans la boucle et on recommencera
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