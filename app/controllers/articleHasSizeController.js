const ArticleHasSize = require('../models/articleHasSize');

const articleHasSizeController = {

    // get all associations between size and articles
    getAll: async (request, response) => {
        try {
            const articleHasSize = await ArticleHasSize.findAll()
            response.json(articleHasSize)
        }
        catch (err) {
            response.status(404).json(`L'articleHasSize n'existe pas`);
        }
    },

    getAllInSize: async (request, response) => {
        const id = request.params.id;
        try {
            const articleHasSize = await ArticleHasSize.findAllInSize(id);
            response.json(articleHasSize);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    // create an association between size and article
    create: async (request, response) => {
        const newArticleHasSizeData = request.body;
        const newArticleHasSize = new ArticleHasSize(newArticleHasSizeData);
        await newArticleHasSize.insert();
        response.json(newArticleHasSize);
    },


};


module.exports = articleHasSizeController;