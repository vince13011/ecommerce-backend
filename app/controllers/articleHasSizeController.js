const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const articleHasSizeController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await ArticleHasSize.findAll();
        res.json(response);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await ArticleHasSize.findOne({
            where: {
                id,
            }
        });
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

module.exports = articleHasSizeController;