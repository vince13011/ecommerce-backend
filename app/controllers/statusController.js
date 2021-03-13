const { Article, Category, Size, User, Order, Address, ArticleHasSize, Status } = require('../models/index');
const sequelize = require('../database');

const statusController = {

    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await Status.findAll({
            limit: limit,
        });
        res.json(response);
    },

    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await Status.findByPk(id);
        res.json(response);
    },

    create: async (req, res) => {
        /* Voici la structure que doit avoir le req.body
        {
            "status_name": ""
        }
        */
        const data = req.body;

        // 1) je crée Status avec les req.body
        const status = await Status.create({ ...data });
        console.log(status);
        // on renvoie le JSON article

        res.json(status);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const statusUpdate = await Status.update(
            {
                ...data
            }, {
            where: {
                id: id,
            }
        });
        const updatedStatus = await Status.findByPk(id);
        res.json(updatedStatus);
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const status = await Status.findByPk(id);
            status.destroy();

            res.json(status);
        } catch (error) {
            console.log('error', error)
        }

    },
};

module.exports = statusController;