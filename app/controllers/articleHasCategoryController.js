const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const articleHasCategoryController = {

    //retourne toutes les relations entre les articles et les categories qui leurs sont liés
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await sequelize.query(`SELECT * FROM article_has_category;`);
        res.json(response);
    },

    //retourne toutes les relations entre un article et les categories qui lui sont lié
    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await sequelize.query(`SELECT * FROM article_has_category WHERE "id"=${id};`);
        if (!response) {
            res.status(400).json(`pas de liaison article_has_category avec l'id ${id}`)
        }
        res.json(response);
    },


    create: async (article_id, data) => {

        /* ici la data reçu nous vient articleController.create
        Voici la structure que doit avoir le req.body
        on va créer une categorie si elle n'existe pas déjà
        {
            "id": 1,
            "title": "homme"
        }
        */

        // 1) on cherche à retrouver l'id de category_title
        const categoryId = await Category.findOrCreate({
            // attributes = permet un SELECT de "id" dans ce cas
            attributes: ['id'],
            // size_name qui se trouve dans la table...
            where: {
                title: data.title
            },
        });

        // 2) insérer le tout : toutes les data qu'on a updaté dans ArticleHasSize
        const articleHasCategory = await sequelize.query(
            `
                INSERT INTO "article_has_category" 
                ("article_id", "category_id") 
                VALUES (${article_id}, ${categoryId[0].id})
            `);
    },


    update: async (article_id, data) => {
        // Premierement on delete toutes les category associé à l'article en question 
        await sequelize.query(
            `
                DELETE FROM "article_has_category" WHERE "article_id"=${article_id}
            `
        );
        // on boucle sur data.categories 
        [...data].forEach(async (category) => {
            // soit on crée une category soit on cherche son id avec son title
            const categoryId = await Category.findOrCreate({
                where: {
                    title: category.title,
                }
            });
            // on insert le category id et l'article id dans article_has_category pour les lier
            await sequelize.query(
                `
                    INSERT INTO "article_has_category" ("article_id", "category_id")
                    VALUES (${article_id}, ${categoryId[0].id})
                `
            )
        });
    },

    // on supprime les liaisons entre un article et ses categories
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