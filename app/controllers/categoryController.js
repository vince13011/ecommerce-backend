const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const categoryController = {

     //retourne toutes les categories 
    getAll: async (req, res) => {
        const { limit } = req.query;
        const categories = await Category.findAll({
            limit: limit,
        });
        res.json(categories);
    },

    //retourne une seule category 
    getOne: async (req, res) => {
        const { id } = req.params;
        const category = await Category.findOne({
            where: {
                id,
            }
        });
        if (!category) {
            res.status(400).json(`pas d'article avec l'id ${id}`)
        }
        res.json(category);
    },

    // on crée une category
    create: async (req, res) => {
        /* Voici la structure que doit avoir le req.body
        {
            "title": ""
        }
        */
        const data = req.body;

        // 1) je crée Category avec les req.body
        const category = await Category.create({ ...data });
        console.log(category);
        // on renvoie le JSON article
        if (!category) {
            res.status(400).json(`La création de la catégorie a échoué`)
        }
        res.json(category);
    },

    update: async (req, res) => {
        
        const { id } = req.params;
        const data = req.body;

        //on vérifie que la category existe
        const verification = await Category.findByPk(id)
        if (!verification) {
            res.status(400).json(`la category avec l'id ${id} n'existe pas`);
            return next();
        }

         // on update la category avec les données de req.body
        const categoryUpdate = await Category.update(
            {
                ...data
            }, {
            where: {
                id: id,
            }
        });
        const updatedCategory = await Category.findByPk(id);
        res.json(updatedCategory);
    },

    //suppresion d'une category
    delete: async (req, res) => {
        
            const { id } = req.params;
            
            //on vérifie que la category existe avant la suppresion
            const category = await Category.findByPk(id);
            if (!category) {
                res.status(400).json(`la category avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next()
            }

            category.destroy();

                //si la category existe toujours on renvoie une erreur
            const categoryExist = await Category.findByPk(id);
            if (categoryExist) {
                res.status(400).json(`la category avec l'id ${id} n'a pas était supprimé`);
            };

            res.json(`La category est supprimée`);
      

    },
};

module.exports = categoryController;