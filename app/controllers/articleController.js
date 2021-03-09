const { Article, Category, Size, User, Order, Address } = require('../models/index');

const mainController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const articles = await Article.findAll({
            attributes: {
                exclude: ['created_at', 'updated_at']
            },
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

            limit,
            order: [
                ['created_at', 'ASC']
            ]
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
        console.log(data);

        const article = await Article.create({
            ...data
        });
        res.json(article);
    }
};

module.exports = mainController;