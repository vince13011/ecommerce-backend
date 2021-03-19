const { Article, Category, Size, User, Order, Address, ArticleHasSize, Status } = require('../models/index');
const sequelize = require('../database');

const statusController = {

    //retourne tout les status
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

    //retourne une size
    getOne: async (req, res) => {
        const { id } = req.params;
        const status = await Status.findByPk(id);

        if (!status) {
            res.status(400).json(`Il n'y a aucun statut avec l'id ${id}`);
            next();
        }
        res.json(status);
    },

    //création d'un status
    create: async (req, res) => {
        /* Voici la structure que doit avoir le req.body
        {
            "status_name": ""
        }
        */
        const data = req.body;
        const status = await Status.create({ ...data });
        res.json(status);
    },

    //on modifie un status
    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        //on vérifie que le status existe bien
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

        //on vérifie que le status existe avant la suppresion
        const status = await Status.findByPk(id);

        if (!status) {
            res.status(400).json(`le status avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
            next();
        }
        status.destroy();

         //si le status existe toujours on renvoie une erreur
        const statusExist = await Status.findByPk(id);
        if (statusExist) {
            res.status(400).json(`le status avec l'id ${id} n'a pas était supprimé`);
        };



            res.json(status);
       


    },
};

module.exports = statusController;