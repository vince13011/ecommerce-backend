const { Article, Category, Size, User, Order, Address } = require('../models/index');
const articleHasSizeController = require('./articleHasSizeController');
const articleHasCategoryController = require('./articleHasCategoryController');
const sequelize = require('../database');
const { error } = require('../joiSchemas/testSchema');


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
    
        if(!article){
        res.json(`l'article avec l'id ${id} n'existe pas`);
        return next()
        }
        res.json(article);
    },

    create: async (req, res) => {
        const data = req.body;


        // 1) je crée l'article avec les req.body
        const article = await Article.create({ ...data });

        const newArticleId = article.dataValues.id;
        // console.log(newArticleId);

        // 2) LIER des CATEGORIES à l'article
        [...data.categories].forEach(async (category) => {
            articleHasCategoryController.create(newArticleId, category);
        });

        // 3) LIER des SIZES à l'article
        [...data.sizes].forEach(async (size) => {
            // on récupère la fonction create depuis le controller articleHasSize
            // on la boucle pour autant de fois qu'il y a d'éléments : data.sizes
            articleHasSizeController.create(newArticleId, size);
        });

        // on renvoie le JSON article
        res.json(article);
    },

    update: async (req, res, next) => {
        const { id } = req.params;
        const data = req.body;
       try{
    

                (async ()=>{
                const verification = await Article.findByPk(id)
                if(!verification){
                res.json(`l'article avec l'id ${id} n'existe pas`);
                return next()
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
                
                // je renvoie vers la fonction update de articleHasCategoryController
            const updateCategory= await articleHasCategoryController.update(id, data.categories);
            // je renvoie vers la fonction update de articleHasSizeController
            const updatesize= await articleHasSizeController.update(id, data.sizes);
                
                // en essaye de prendre le nouvel article modifé
            const updatedArticle = await Article.findOne({
                where: {
                    id,
                },
                include: [
                    'categories',
                    'sizes']
            })
    
            res.json(`l'article avec l'id ${id} a bien était modifié`) 
            })();
    }

    catch(err){
        console.error(err.stack)
    }

    },

    delete: async (req, res) => {
        console.log('object')
        try {
            const { id } = req.params;
            const article = await Article.findByPk(id);
                if(!article){
                res.json(`l'article avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next()
                }
            article.destroy();
            res.json(`l'article avec l'id ${id} vient d' être supprimé`);
        } catch (error) {
            console.log( error.stack)
        }
    },
};

module.exports = articleController;