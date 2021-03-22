const { Article, Category, Size, User, Order, Address } = require('../models/index');
const articleHasSizeController = require('./articleHasSizeController');
const articleHasCategoryController = require('./articleHasCategoryController');
const sequelize = require('../database');
const jwtUtils = require('../services/jwt.utils');



const articleController = {

// return all the items with their different categories, sizes and stock depending on the sizes
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

// return a single item with its different categories, sizes and stock depending on the sizes
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

// create a new article with the possibility of also creating its categories and sizes
    create: async (req, res) => {
        const data = req.body;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }



        // 1)I create the article with the req.body
        const article = await Article.create({ ...data });

        const newArticleId = article.dataValues.id;

        // 2) Link CATEGORIES to the article
        [...data.categories].forEach(async (category) => {
            
            // we get the create function from the articleHasCategory controller
            // we loop it for as many times as there are elements: data.categories
            articleHasCategoryController.create(newArticleId, category);
        });

        // 3) LINK sizes to the article
        [...data.sizes].forEach(async (size) => {
            // we get the create function from the articleHasSize controller
            // we loop it for as many times as there are elements: data.sizes
            articleHasSizeController.create(newArticleId, size);
        });

        res.json(article);
    },

     // updating of an article according to its id
    update: async (req, res, next) => {
        const { id } = req.params;
        const data = req.body;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }

        
            (async () => {
                
                // we check that the article exists
                const verification = await Article.findByPk(id)
                if (!verification) {
                    res.status(400).json(`l'article avec l'id ${id} n'existe pas`);
                    return next();
                }
                // we update Article with data from req.body
                await Article.update(
                    {
                        ...data
                    }, {
                    where: {
                        id: id,
                    }
                });
                // to also modify the categories and sizes which are linked to it:
                // I refer to the update function of articleHasCategoryController
                const updateCategory = await articleHasCategoryController.update(id, data.categories);
                // I refer to the update function of articleHasSizeController                
                const updatesize = await articleHasSizeController.update(id, data.sizes);

                // we get the new modified article with its categories and sizes
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

   
    // delete an article
    delete: async (req, res) => {
        const {id} = req.params;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getAdminId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ 'error': 'token absent' });
        }
            
            // we check that the article exists before the deletion            const { id } = req.params;
            const article = await Article.findByPk(id);
            if (!article) {
                res.status(400).json(`l'article avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next()
            }
            //we delete it
            await article.destroy();

            // if the article still exists, we return an error
            const articleExist = await Article.findByPk(id);
            if (articleExist) {
                res.status(400).json(`l'article avec l'id ${id} n'a pas été supprimé`);
            };

            res.json(`l'article avec l'id ${id} vient d' être supprimé`);

    },
};

module.exports = articleController;