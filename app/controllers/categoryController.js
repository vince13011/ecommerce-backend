const { response } = require('express');
const Category = require('../models/category');

const categoryController = {

    getAll: async (request, response) => {
        try {
            const categories = await Category.findAll()
            response.json(categories)
        }
        catch (err) {
            response.status(404).json(`La categorie n'existe pas`);
        }
    },

    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const category = await Category.findOne(id);
            response.json(category);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    create: async (request, response) => {
        // les infos de la category à ajouter
        const newCategoryData = request.body;

        // console.log('newCategorydata: ', newCategoryData);
        const newCategory = new Category(newCategoryData);
        // console.log('newCategory: ', newCategory);

        await newCategory.insert();

        response.json(newCategory);
    },

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        const data = request.body;

        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theCategory = await Category.findOne(id);

            // par mesure de sécurité on supprime la possibilité de modifier l'id 
            if (data.id) {
                delete (data.id)
            }

            const newdata = theCategory;

            console.log('newdata: ', newdata)
            // newdata.updated_at = "NOW()";

            for (const element in data) {
                if (typeof newdata[element] !== 'undefined') {
                    //on modifie newdata qui contient les données actuelles de l'category
                    // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
                    newdata[element] = data[element];
                }
            }

            //je renvoie le jeu avec ses nouvelles informations en base de données
            const result = await theCategory.updateById(newdata);

            response.json(result);
        }
        catch (err) {
            response.status(404).json(`La category avec l'id ${id} n'existe pas ou a déjà était supprimé`);
        }
    },

    deleteById: async (request, response) => {
        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;
        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theCategory = await Category.findOne(id);

            await theCategory.deleteById();

            response.json(`L'category avec l'id ${id} a bien été supprimé`);
        }
        catch (err) {
            response.status(404).json(`L'category l'id ${id} n'existe pas ou a déjà été supprimé`);
        }
    },

};

module.exports = categoryController;