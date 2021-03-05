const { response } = require('express');
const Size = require('../models/size');

const sizeController = {

    getAll: async (request, response) => {
        try {
            const categories = await Size.findAll()
            response.json(categories)
        }
        catch (err) {
            response.status(404).json(`La categorie n'existe pas`);
        }
    },

    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const size = await Size.findOne(id);
            response.json(size);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    create: async (request, response) => {
        // les infos de la size à ajouter
        const newSizeData = request.body;

        console.log('newSizedata: ', newSizeData);
        const newSize = new Size(newSizeData);
        console.log('newSize: ', newSize);

        await newSize.insert();

        response.json(newSize);
    },

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        const data = request.body;

        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theSize = await Size.findOne(id);

            // par mesure de sécurité on supprime la possibilité de modifier l'id 
            if (data.id) {
                delete (data.id)
            }

            const newdata = theSize;

            console.log('newdata: ', newdata)
            // newdata.updated_at = "NOW()";

            for (const element in data) {
                if (typeof newdata[element] !== 'undefined') {
                    //on modifie newdata qui contient les données actuelles de l'size
                    // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
                    newdata[element] = data[element];
                }
            }

            //je renvoie le jeu avec ses nouvelles informations en base de données
            const result = await theSize.updateById(newdata);

            response.json(result);
        }
        catch (err) {
            response.status(404).json(`La size avec l'id ${id} n'existe pas ou a déjà était supprimé`);
        }
    },

    deleteById: async (request, response) => {
        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;
        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theSize = await Size.findOne(id);

            await theSize.deleteById();

            response.json(`L'size avec l'id ${id} a bien été supprimé`);
        }
        catch (err) {
            response.status(404).json(`L'size l'id ${id} n'existe pas ou a déjà été supprimé`);
        }
    },

};

module.exports = sizeController;