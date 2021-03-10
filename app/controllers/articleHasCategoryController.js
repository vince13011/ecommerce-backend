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
        const categoryId = await Category.findOne({
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
                VALUES (${article_id}, ${categoryId.id})
            `);
    },

    // // ATTENTION : cela update UNIQUEMENT l'article, pas les categories 
    // // et les sizes, pour cela, il faut faire des routes PATCH pour 
    // // article_has_size et article_has_category
    // update: async (req, res) => {
    //     const { id } = req.params;
    //     const data = req.body;
    //     const articleUpdate = await Article.update(
    //         {
    //             ...data
    //         }, {
    //         where: {
    //             id: id,
    //         }
    //     });

    //     // une fois que l'article a été updaté, il est renvoyé avec les nouvelles données
    //     const article = await Article.findOne(
    //         {
    //             where: {
    //                 id: id
    //             },
    //             include: ['categories', 'sizes']
    //         }
    //     );
    //     res.json(article)
    // },

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