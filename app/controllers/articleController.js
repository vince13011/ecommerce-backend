const { Article, Category, Size, User, Order, Address } = require('../models/index');
const sequelize = require('../database');

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
                ['updated_at', 'ASC']
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
        const article = await Article.create({
            ...data,
        }, {
            include: [
                'categories', 'sizes'
            ]
        });
        res.json(article);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const oldArticle = await Article.findOne({
            where: {
                id,
            },
            include: [
                'categories',
                'sizes'
            ],
        });
        const article = await Article.update({
            ...data,
        }, {
            where: {
                id,
            },
            include: [
                'categories', 'sizes'
            ]
        });
        data.categories.forEach(async (category, index) => {
            console.log('index', index)
            const newCategoryId = category.article_has_category.category_id;
            const oldCategoryId = oldArticle.dataValues.categories[index].dataValues.article_has_category.dataValues.category_id;
            await sequelize.query(`UPDATE "article_has_category" 
            SET "category_id"=${newCategoryId} 
            WHERE "article_id"=${id} AND "category_id"=${oldCategoryId}`);
        });
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

module.exports = mainController;