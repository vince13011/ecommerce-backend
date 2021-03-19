const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const sizeController = {

     //retourne toutes les sizes
    getAll: async (req, res) => {
        const { limit } = req.query;
        const response = await Size.findAll({
            limit: limit,
        });
        res.json(response);
    },

     //retourne une seule category 
    getOne: async (req, res) => {
        const { id } = req.params;
        const response = await Size.findByPk(id);
        if (!response) {
            res.status(400).json(`La size avec l'id ${id} n'existe pas`)
        }
        res.json(response);

    },

    // on crée une size
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
        if (!size) {
            res.status(400).json(`La  création de cette size a échoué`)
        }
        res.json(size);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const data = req.body;


        //on vérifie que la size existe
        const verification = await Size.findByPk(id)
        if (!verification) {
            res.status(400).json(`la size avec l'id ${id} n'existe pas`);
            return next();
        }

        // on update la size avec les données de req.body
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

    //suppresion d'une size
    delete: async (req, res) => {

            const { id } = req.params;

              //on vérifie que la size existe avant la suppresion
              const size = await Size.findByPk(id);
              if (!size) {
                  res.status(400).json(`la size avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                  return next()
              }
      
            size.destroy();

             //si la size existe toujours on renvoie une erreur
            const sizeExist = await Size.findByPk(id);
            if (sizeExist) {
                res.status(400).json(`la size avec l'id ${id} n'a pas était supprimé`);
            };

            res.json(size);
       
        

    },
};

module.exports = sizeController;