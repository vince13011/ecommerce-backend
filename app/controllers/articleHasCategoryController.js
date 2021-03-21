const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const articleHasCategoryController = {

// return all the relations between the articles and the categories which are linked to them
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await sequelize.query(`SELECT * FROM article_has_category;`);
        res.json(response);
    },

// return all the relations between an article and the categories which are linked to it
    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await sequelize.query(`SELECT * FROM article_has_category WHERE "id"=${id};`);
        if (!response) {
            res.status(400).json(`pas de liaison article_has_category avec l'id ${id}`)
        }
        res.json(response);
    },


    create: async (article_id, data) => {

        /* here the data received comes to us articleController.create
        Here is the structure that the req.body must have
        we will create a category if it does not already exist
        {
            "id": 1,
            "title": "homme"
        }
        */

        // 1) we try to find the id of category_title
        const categoryId = await Category.findOrCreate({
        // attributes = allow a SELECT of "id" in this case
            attributes: ['id'],
        // size_name which is in the table ...
            where: {
                title: data.title
            },
        });

        // 2) insert everything: all the data we have updated in ArticleHasSize
        const articleHasCategory = await sequelize.query(
            `
                INSERT INTO "article_has_category" 
                ("article_id", "category_id") 
                VALUES (${article_id}, ${categoryId[0].id})
            `);
    },


    update: async (article_id, data) => {
        // First we delete all the categories associated with the article in question
        await sequelize.query(
            `
                DELETE FROM "article_has_category" WHERE "article_id"=${article_id}
            `
        );

        // we loop on data.categories
        [...data].forEach(async (category) => {
            
            // either we create a category or we get its id with its title
            const categoryId = await Category.findOrCreate({
                where: {
                    title: category.title,
                }
            });
            // we insert the category id and the article id in article_has_category to link them
            await sequelize.query(
                `
                    INSERT INTO "article_has_category" ("article_id", "category_id")
                    VALUES (${article_id}, ${categoryId[0].id})
                `
            )
        });
    },

// we delete the links between an article and its categories
    delete: async (req, res) => {
        const { id } = req.params;
        await sequelize.query(
            `
                DELETE FROM "article_has_category" WHERE "article_id"=${id}
            `
        );
        res.json(`l'association avec article_id=${id} a bien été supprimée`);
    }
};

module.exports = articleHasCategoryController;