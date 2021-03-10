const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const categoryController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const categories = await Category.findAll({
            limit: limit,
        });
        res.json(categories);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const category = await Category.findOne({
            where: {
                id,
            }
        });
        res.json(category);
    },

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

        res.json(category);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
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

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            category.destroy();

            res.json(category);
        } catch (error) {
            console.log('error', error)
        }

    },
};

module.exports = categoryController;