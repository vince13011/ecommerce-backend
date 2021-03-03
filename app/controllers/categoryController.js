const { response } = require('express');
const Category = require('../models/category');

const categoryController = {

    getAll: async (request, response) => {
        try {
            const result = await Category.findAll()
            response.json(result)
        }
        catch (err) {
            response.status(404).json(`La categorie n'existe pas`);
        }
    },
    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const game = await Category.findOne(id);
            response.json(game);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    }

};

module.exports = categoryController;