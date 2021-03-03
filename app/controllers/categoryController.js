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


    // ////////////////////////////////////

    create: async (request, response) => {
        // les infos de la category à ajouter
        const newCategoryData = request.body;

        console.log('newCategorydata: ', newCategoryData);
        const newCategory = new Category(newCategoryData);
        console.log('newarticle: ', newCategory);

        await newCategory.insert();

        response.json(newCategory);
    },

};

module.exports = categoryController;