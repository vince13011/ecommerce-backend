const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');
const { Query } = require('pg');

const articleHasSizeController = {

    // return all the relations between the articles and the size which are linked to them
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await ArticleHasSize.findAll();
        res.json(response);
    },


    // return all the relations between an article and the sizes which are linked to it
    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await ArticleHasSize.findOne({
            where: {
                id,
            }
        });
        if (!response) {
            res.status(400).json(`pas de liaison article_has_category avec l'id ${id}`)
        }
        res.json(response);
    },


    create: async (article_id, data) => {
        /* Here is the structure that the req.body must have
        we will put size name, on the other hand it will be necessary
        do a search to find the corresponding id
        to this size_name
        {
            "stock": 20,
            "article_id": 2,
            "size_name": "L"
        }
        */

        // this one to do the test
        // const data = req.body;

        // 1) we try to find the id of size_name, and if it doesn't exist, we create it
        const sizeId = await Size.findOrCreate({
            // attributes = allow a SELECT of "id" in this case
            attributes: ['id'],
            // size_name which is in the table ...
            where: {
                size_name: data.size_name
            },
        });

        // 2) insert everything: all the data we have updated in ArticleHasSize
        const articleHasSize = await ArticleHasSize.create({
            // data is in parameter and will be retrieved in the articleController controller
            stock: data.stock,
            // when we create a new one in this table, we need
            // also from the article_id, which will be returned / retrieved in the article controller
            article_id: article_id,

            // this one to do the test directly in the controller here


            // we put the id
            size_id: sizeId[0].id
        });

        // we return the JSON article
        // res.json (sizeId);
    },

    update: async (article_id, data) => {
             
        // First we delete all the sizes associated with the article in question
        await sequelize.query(
            `
                DELETE FROM "article_has_size" WHERE "article_id"=${article_id}
            `
        );

        // we loop on data.sizes 
        [...data].forEach(async (size) => {

            // either we look for an id or we create AND we look for the id of a size with its title
            const sizeId = await Size.findOrCreate({
                where: {
                    size_name: size.size_name,
                }
            });

            // we insert the size id and the article id in article_has_size to link them
            await sequelize.query(
                `
                    INSERT INTO "article_has_size" ("article_id", "size_id", "stock")
                    VALUES (${article_id}, ${sizeId[0].id}, ${size.stock})
                `
            )

        });

    },

    // we remove the links between an article and its sizes
    delete: async (req, res) => {
        const { id } = req.params;
        await sequelize.query(
            `
                DELETE FROM "article_has_size" WHERE "article_id"=${id}
            `
        )
        res.json(`l'association avec article_id=${id} a bien été supprimée`);
    },
};

module.exports = articleHasSizeController;