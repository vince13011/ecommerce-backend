const { response } = require('express');
const ArticleHasCategory = require('../models/articleHasCategory');

const articleHasCategoryController = {

    // get all associations between categories and articles
    getAll: async (request, response) => {
        try {
            if (request.query.limit) {
                limit = parseInt(request.query.limit);
                console.log('limit: ', limit);
            }
            const articleHasCategory = await ArticleHasCategory.findAll()
            response.json(articleHasCategory)
        }
        catch (err) {
            response.status(404).json(`L'articleHasCategory n'existe pas`);
        }
    },

    getAllInCategory: async (request, response) => {
        const id = request.params.id;
        try {
            const articleHasCategory = await ArticleHasCategory.findAllInCategory(id);
            response.json(articleHasCategory);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    // create an association between category and article
    create: async (request, response) => {
        const newArticleHasCategoryData = request.body;
        const newArticleHasCategory = new ArticleHasCategory(newArticleHasCategoryData);
        await newArticleHasCategory.insert();
        response.json(newArticleHasCategory);
    },


};


module.exports = articleHasCategoryController;