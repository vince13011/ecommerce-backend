const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const articleHasCategoryController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await sequelize.query(`SELECT * FROM article_has_category;`);
        res.json(response);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await sequelize.query(`SELECT * FROM article_has_category WHERE "id"=${id};`);
        res.json(response);
    },


    create: async (/*req, res,*/ article_id, data) => {
        /* Voici la structure que doit avoir le req.body
        on va mettre size name, par contre il faudra 
        faire une recherche pour retrouver l'id qui correspond 
        à cet size_name
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
        // Premierement on delete toutes les category associé a l'article en question 
        await sequelize.query(
            `
                DELETE FROM "article_has_category" WHERE "article_id"=${article_id}
            `
        );
        // on boucle sur data.categories 
        data.forEach(async (category) => {
            // soit on cherche une id soit on creer ET on cherche l'id d'une category avec son title
            const categoryId = await Category.findOrCreate({
                where: {
                    title: category.title,
                }
            });
            // on insert l'id du category et l'article id dans article has category
            await sequelize.query(
                `
                    INSERT INTO "article_has_category" ("article_id", "category_id")
                    VALUES (${article_id}, ${categoryId[0].id})
                `
            )
        });
    },

    // delete: async (req, res) => {
    //     console.log('object')
    //     try {
    //         const { id } = req.params;
    //         const article = await Article.findByPk(id);
    //         article.destroy();
    //         res.json(article);
    //     } catch (error) {
    //         console.log('error', error)
    //     }

    // },
};

module.exports = articleHasCategoryController;