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

        // 1) je crée l'article avec les req.body
        const article = await Article.create({ ...data });

        const newArticleId = article.dataValues.id;
        // console.log(newArticleId);

        // 2) LIER des CATEGORIES à l'article
        if (data.categories !== []) {
            data.categories.forEach(async (category) => {

                const resCategory = await Category.findOne({
                    attributes:
                        ["id", "title"],
                    where: { title: category }
                });

                // on récupère l'id de la categorie choisie par l'utilisateur en front
                const categoryId = resCategory.dataValues.id;
                // console.log('category id :', categoryId);

                // on insert dans la table de liaison article_has_category
                // une nouvelle colonne de relation entre article et categorie
                await sequelize.query(`
                    INSERT INTO "article_has_category" 
                        ("category_id", "article_id") 
                        VALUES 
                        (${categoryId}, ${newArticleId});
                `);
            });
        }

        // 2) LIER des SIZES à l'article
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

module.exports = mainController;