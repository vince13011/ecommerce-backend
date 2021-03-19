const { Article, Category, Size, User, Order, Address } = require('../models/index');
const articleHasSizeController = require('./articleHasSizeController');
const articleHasCategoryController = require('./articleHasCategoryController');
const sequelize = require('../database');
const jwtUtils = require('../services/jwt.utils');



const articleController = {

    //retourne l'ensemble des articles avec ses différentes categories, tailles et stock en fonction des tailles
    getAll: async (req, res) => {
        const { limit } = req.query;
        const articles = await Article.findAll({
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

    //retourne un seul article avec ses différentes categories, tailles et stock en fonction des tailles
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

        if (!article) {
            res.status(400).json(`l'article avec l'id ${id} n'existe pas`);
            return next();
        }
        res.json(article);
    },

    //créé une nouvel article avec la possibilités de créer aussi ses catégories et tailles
    create: async (req, res) => {
        const data = req.body;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }



        // 1) je crée l'article avec les req.body
        const article = await Article.create({ ...data });

        const newArticleId = article.dataValues.id;

        // 2) LIER des CATEGORIES à l'article
        [...data.categories].forEach(async (category) => {
            // on récupère la fonction create depuis le controller articleHasCategory
            // on la boucle pour autant de fois qu'il y a d'éléments : data.categories
            articleHasCategoryController.create(newArticleId, category);
        });

        // 3) LIER des SIZES à l'article
        [...data.sizes].forEach(async (size) => {
            // on récupère la fonction create depuis le controller articleHasSize
            // on la boucle pour autant de fois qu'il y a d'éléments : data.sizes
            articleHasSizeController.create(newArticleId, size);
        });

        res.json(article);
    },

    update: async (req, res, next) => {
        const { id } = req.params;
        const data = req.body;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }

        
            (async () => {
                //on vérifie que l'article existe
                const verification = await Article.findByPk(id)
                if (!verification) {
                    res.status(400).json(`l'article avec l'id ${id} n'existe pas`);
                    return next();
                }
                // on update Article avec les données de req.body
                await Article.update(
                    {
                        ...data
                    }, {
                    where: {
                        id: id,
                    }
                });
                //pour modifier aussi les categories et sizes qui lui sont lié :
                // je renvoie vers la fonction update de articleHasCategoryController
                const updateCategory = await articleHasCategoryController.update(id, data.categories);
                // je renvoie vers la fonction update de articleHasSizeController
                const updatesize = await articleHasSizeController.update(id, data.sizes);

                // on récupère le nouvel article modifé avec ses categories et sizes
                const updatedArticle = await Article.findOne({
                    where: {
                        id,
                    },
                    include: [
                        'categories',
                        'sizes']
                });

                res.json(`l'article avec l'id ${id} a bien était modifié`)
            })();
     
    },

    //suppresion d'un article
    delete: async (req, res) => {
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }

            //on vérifie que l'article existe avant la suppresion
            const { id } = req.params;
            const article = await Article.findByPk(id);
            if (!article) {
                res.status(400).json(`l'article avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next()
            }
            //on le supprime
            article.destroy();

            //si l'article existe toujours on renvoie une erreur
            const articleExist = await Article.findByPk(id);
            if (articleExist) {
                res.status(400).json(`l'article avec l'id ${id} n'a pas était supprimé`);
            };

            res.json(`l'article avec l'id ${id} vient d' être supprimé`);

    },
};

module.exports = articleController;