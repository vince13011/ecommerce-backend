const { Article, Category, Size, User, Order, Address, ArticleHasSize, Status } = require('../models/index');
const sequelize = require('../database');

const statusController = {

    //return all status
    getAll: async (req, res) => {
        const { limit } = req.query;
        const status = await Status.findAll({
            // limit: limit,
        });

        if (!status) {
            res.status(400).json(`Il n'y a aucun statut qui existe`);
            next();
        }

        res.json(status);
    },

    //return a single status
    getOne: async (req, res) => {
        const { id } = req.params;
        const status = await Status.findByPk(id);

        if (!status) {
            res.status(400).json(`Il n'y a aucun statut avec l'id ${id}`);
            next();
        }
        res.json(status);
    },

    //creation of a status
    create: async (req, res) => {
        /* This is the structure that the req.body should have
        {
            "status_name": ""
        }
        */
        const data = req.body;
        const status = await Status.create({ ...data });
        res.json(status);
    },

    // // we update a status
    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        // we check that this status does exist
        const status = await Status.findByPk(id);

        if (!status) {
            res.status(400).json(`Il n'y a aucun statut qui existe`);
            next();
        }

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
        const { id } = req.params;

        // we check that the status exists before the deletion
        const status = await Status.findByPk(id);

        if (!status) {
            res.status(400).json(`le status avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
            next();
        }
        status.destroy();


        // if the status still exists, an error is returned
        const statusExist = await Status.findByPk(id);
        if (statusExist) {
            res.status(400).json(`le status avec l'id ${id} n'a pas était supprimé`);
        };



            res.json(status);
       


    },
};

module.exports = statusController;