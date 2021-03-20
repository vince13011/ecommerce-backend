const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const categoryController = {

// return all categories
    getAll: async (req, res) => {
        const { limit } = req.query;
        const categories = await Category.findAll({
            limit: limit,
        });
        res.json(categories);
    },

   // return a single category
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

    // we create a category
    create: async (req, res) => {
        /* This is the structure that the req.body should have
        {
            "title": ""
        }
        */
        const data = req.body;

        // 1) I create Category with the req.body
        const category = await Category.create({ ...data });
        console.log(category);
        // we return the JSON article
        if (!category) {
            res.status(400).json(`La création de la catégorie a échoué`)
        }
        res.json(category);
    },

    update: async (req, res) => {
        
        const { id } = req.params;
        const data = req.body;

        // we check that this category exists
        const verification = await Category.findByPk(id)
        if (!verification) {
            res.status(400).json(`la category avec l'id ${id} n'existe pas`);
            return next();
        }

        // we update the category with the data from req.body
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

    //we delete a category
    delete: async (req, res) => {
        
            const { id } = req.params;
            
        // we check that this category exists before the deletion
            const category = await Category.findByPk(id);
            if (!category) {
                res.status(400).json(`la category avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next()
            }

            category.destroy();

            // if this category still exists, we return an error
            const categoryExist = await Category.findByPk(id);
            if (categoryExist) {
                res.status(400).json(`la category avec l'id ${id} n'a pas était supprimé`);
            };

            res.json(`La category est supprimée`);
      

    },
};

module.exports = categoryController;