const { Article, Category, Size, User, Order, Address } = require('../models/index');
const articleHasSizeController = require('./articleHasSizeController');
const articleHasCategoryController = require('./articleHasCategoryController');
const sequelize = require('../database');

const articleController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const articles = await Article.findAll({
            // attributes: {
            //     exclude: ['updated_at']
            // },
            include: [
                {
                    association: 'categories',
                    attributes: ['title'],
                },
                {
                    association: 'sizes',
                    attributes: ['size_name'],
                }
            ],
            order: [
                ['updated_at', 'DESC']
            ],
            limit: limit,
        });
        res.json(articles);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const article = await Article.findOne({
            where: {
                id,
            },
            include: [
                'categories',
                'sizes'
            ],
        });
        res.json(article);
    },

    create: async (req, res) => {
        const data = req.body;


        // 1) je crée l'article avec les req.body
        const article = await Article.create({ ...data });

        const newArticleId = article.dataValues.id;
        // console.log(newArticleId);

        // 2) LIER des CATEGORIES à l'article
        data.categories.forEach(async (category) => {
            articleHasCategoryController.create(newArticleId, category);
        });

        // 3) LIER des SIZES à l'article
        data.sizes.forEach(async (size) => {
            // on récupère la fonction create depuis le controller articleHasSize
            // on la boucle pour autant de fois qu'il y a d'éléments : data.sizes
            articleHasSizeController.create(newArticleId, size);
        });

        // on renvoie le JSON article
        res.json(article);
    },

    // ATTENTION : cela update UNIQUEMENT l'article, pas les categories 
    // et les sizes, pour cela, il faut faire des routes PATCH pour 
    // article_has_size et article_has_category
    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const articleUpdate = await Article.update(
            {
                ...data
            }, {
            where: {
                id: id,
            }
        });

        // une fois que l'article a été updaté, il est renvoyé avec les nouvelles données
        const article = await Article.findOne(
            {
                where: {
                    id: id
                },
                include: ['categories', 'sizes']
            }
        );
        res.json(article)
    },

    delete: async (req, res) => {
        console.log('object')
        try {
            const { id } = req.params;
            const article = await Article.findByPk(id);
            article.destroy();
            res.json(article);
        } catch (error) {
            console.log('error', error)
        }

    },
};

module.exports = articleController;