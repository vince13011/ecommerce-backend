const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');
const { Query } = require('pg');

const articleHasSizeController = {

    //retourne toutes les relations entre les articles et les size qui leurs sont liés
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await ArticleHasSize.findAll();
        res.json(response);
    },

        //retourne toutes les relations entre un article et les sizes qui lui sont lié
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


    create: async (/*req, res,*/ article_id, data) => {
        /* Voici la structure que doit avoir le req.body
        on va mettre size name, par contre il faudra 
        faire une recherche pour retrouver l'id qui correspond 
        à cet size_name
        {
            "stock": 20,
            "article_id": 2,
            "size_name": "L"
        }
        */

        // celui-ci pour faire le test
        // const data = req.body;

        // 1) on cherche à retrouver l'id de size_name, et s'il n'existe pas, on le crée
        const sizeId = await Size.findOrCreate({
            // attributes = permet un SELECT de "id" dans ce cas
            attributes: ['id'],
            // size_name qui se trouve dans la table...
            where: {
                size_name: data.size_name
            },
        });

        // 2) insérer le tout : toutes les data qu'on a updaté dans ArticleHasSize
        const articleHasSize = await ArticleHasSize.create({
            // data est en paramètre et sera récupéré dans le controller articleController
            stock: data.stock,
            // lorsqu'on crée une nouvelle dans cette table, on a besoin 
            // aussi de l'article_id, qui sera renvoyé / retrouvé dans le controller article
            article_id: article_id,

            // celui ci pour faire le test directement dans le controller ici
            // article_id: data.article_id,

            // on met l'id 
            size_id: sizeId[0].id
        });

        // on renvoie le JSON article
        // res.json(sizeId);

    },

    update: async (article_id, data) => {
             
        // Premierement on delete toutes les sizes associé à l'article en question 
        await sequelize.query(
            `
                DELETE FROM "article_has_size" WHERE "article_id"=${article_id}
            `
        );

        // on boucle sur data.sizes 
        [...data].forEach(async (size) => {
            // soit on cherche une id soit on creer ET on cherche l'id d'une size avec son title
            const sizeId = await Size.findOrCreate({
                where: {
                    size_name: size.size_name,
                }
            });

            // on insert le size id et l'article id dans article_has_size pour les lier
            await sequelize.query(
                `
                    INSERT INTO "article_has_size" ("article_id", "size_id", "stock")
                    VALUES (${article_id}, ${sizeId[0].id}, ${size.stock})
                `
            )

        });

    },

    // on supprime les liaisons entre un article et ses sizes
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