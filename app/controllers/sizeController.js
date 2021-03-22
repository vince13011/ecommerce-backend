const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const sizeController = {

    // return all sizes
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await Size.findAll({
            limit: limit,
        });
        res.json(response);
    },

    //return a single category 
    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await Size.findByPk(id);
        if (!response) {
            res.status(400).json(`La size avec l'id ${id} n'existe pas`)
        }
        res.json(response);

    },

    // we create a size
    create: async (req, res) => {
        /* Here is the structure that the req.body must have
        {
            "size_name": ""
        }
        */
        const data = req.body;

        // 1) I create size with the req.body
        const size = await Size.create({ ...data });
        console.log(size);
        // we return the JSON article
        if (!size) {
            res.status(400).json(`La  création de cette size a échoué`)
        }
        res.json(size);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;


        // we check that this size exists
        const verification = await Size.findByPk(id)
        if (!verification) {
            res.status(400).json(`la size avec l'id ${id} n'existe pas`);
            return next();
        }

        // we update the size with the data from req.body
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

    //delete a size
    delete: async (req, res) => {

        const { id } = req.params;

        // we check that this size exists before the deletion
        const size = await Size.findByPk(id);
        if (!size) {
            res.status(400).json(`la size avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
            return next()
        }

        size.destroy();

        // if this size still exists, we return an error
        const sizeExist = await Size.findByPk(id);
        if (sizeExist) {
            res.status(400).json(`la size avec l'id ${id} n'a pas était supprimé`);
        };

        res.json(size);



    },
};

module.exports = sizeController;