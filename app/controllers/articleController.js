const { response } = require('express');
const Article = require('../models/article');

const articleController = {

    getAll: async (request, response) => {
        try {
            const articles = await Article.findAll()
            response.json(articles)
        }
        catch (err) {
            response.status(404).json(`L'article n'existe pas`);
        }
    },
    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const article = await Article.findOne(id);
            response.json(article);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    }

};

module.exports = articleController;