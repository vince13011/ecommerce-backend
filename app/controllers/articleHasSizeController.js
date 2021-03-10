const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const articleHasSizeController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await ArticleHasSize.findAll({
            limit: limit,
        });
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

    create: async (req, res) => {
        /* Voici la structure que doit avoir le req.body
        {
            "stock": 20,
            "article_id": 2,
            "size_id": 3
        }
        */
        const data = req.body;

        // 1) je crée Size avec les req.body
        const article = await ArticleHasSize.create({ ...data });

        const newArticleId = article.dataValues.id;
        // console.log(newArticleId);

        // 3) LIER des SIZES à l'article
        if (data.sizes !== []) {
            data.sizes.forEach(async (size) => {

                const resSize = await Size.findOne({
                    attributes:
                        ["id", "size_name"],

                    where: { size_name: size.size_name }
                });
                console.log('size: ', size);

                // on récupère l'id de la size choisie par l'utilisateur en front
                const sizeId = resSize.dataValues.id;

                // on récupère le stock dans body
                const sizeStock = size.stock;

                // on insert dans la table de liaison article_has_size
                // une nouvelle colonne de relation entre article et size
                await sequelize.query(`
                    INSERT INTO "article_has_size" 
                        ("article_id", "size_id", "stock") 
                        VALUES 
                        (${newArticleId}, ${sizeId}, ${sizeStock});
                `);
            });
        }

        // on renvoie le JSON article
        res.json(article);
    },

    // ATTENTION : cela update UNIQUEMENT l'article, pas les categories 
    // et les sizes, pour cela, il faut faire des routes PATCH pour 
    // article_has_size et article_has_category
    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const articleUpdate = await Article.update(
            {
                ...data
            }, {
            where: {
                id: id,
            }
        });

        // une fois que l'article a été updaté, il est renvoyé avec les nouvelles données
        const article = await Article.findOne(
            {
                where: {
                    id: id
                },
                include: ['categories', 'sizes']
            }
        );
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

module.exports = articleHasSizeController;