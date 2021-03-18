const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const sizeController = {
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await Size.findAll({
            limit: limit,
        });
        res.json(response);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await Size.findByPk(id);
        if(!response){
            res.status(400).json(`La size avec l'id ${id} n'existe pas`)
        }
        res.json(response);
        
    },

    create: async (req, res) => {
        /* Voici la structure que doit avoir le req.body
        {
            "size_name": ""
        }
        */
        const data = req.body;

        // 1) je crée Size avec les req.body
        const size = await Size.create({ ...data });
        console.log(size);
        // on renvoie le JSON article
        if(!size){
            res.status(400).json(`La  création de cette size a échoué`)
        }
        res.json(size);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const sizeUpdate = await Size.update(
            {
                ...data
            }, {
            where: {
                id: id,
            }
        });
        const updatedSize = await Size.findByPk(id);
        res.json(updatedSize);
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const size = await Size.findByPk(id);
            size.destroy();

            res.json(size);
        } catch (error) {
            res.status(400).json('error', error)
        }

    },
};

module.exports = sizeController;