const { response } = require('express');
const Article = require('../models/article');
const ArticleHasCategory = require('../models/articleHasCategory');
const ArticleHasSize = require('../models/articleHasSize');

const articleController = {

    getAll: async (request, response) => {
        try {
            if (request.query.limit) {
                limit = parseInt(request.query.limit);
                console.log('limit: ', limit);
                const articles = await Article.findAll(limit)
                response.json(articles);
            }

            else {
                const articles = await Article.findAll()
                response.json(articles)
            }
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
    },

    create: async (request, response) => {
        // les infos de l'article à ajouter
        const newArticleData = request.body;
        console.log(newArticleData);

        const newArticle = new Article(newArticleData);
        // const newArticleHasCategory = new ArticleHasCategory(newArticleData.categories);
        // const newArticleHasSize = new ArticleHasSize(newArticleData);


        await newArticle.insert();
        for (let index = 0; index < newArticleData.categories.length; index++) {
            // selection de plusieurs categories
            const newArticleHasCategory = new ArticleHasCategory(newArticleData.categories[index]);
            await newArticleHasCategory.insert(newArticle.id);
            // selection de plusieurs sizes + stocks
            const newArticleHasSize = new ArticleHasSize(newArticleData.sizes[index]);
            await newArticleHasSize.insert(newArticle.id);
        }

        /* sans await, il va me manquer
         la certitude que tout s'est bien passé
         car la réponse sera envoyé avant la fin de l'enregistrement du jeu en base de données
        */
        response.json(newArticle);
    },

    deleteById: async (request, response) => {
        const { id } = request.params;

        try {
            await Article.delete(id);
            response.json(`L'article avec l'id ${id} a bien été supprimé`);
        }
        catch (err) {
            console.log(err);
            response.status(404).json(`L'article l'id ${id} n'existe pas ou a déjà été supprimé`);
        }
    },

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        // a récupérer les categories en tableau d'objet
        const data = request.body;
        console.log(data);
        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 

            // const ArticleCat = await ArticleHasCategory.findOne(id);
            //par mesure de sécurité on supprime la possibilité de modifier l'id 
            // if (data.id) {
            //     delete (data.id)
            // }

            // const newdata = theArticle;

            // console.log('newdata: ', newdata)
            // newdata.updated_at = "NOW()";

            // for (const element in data) {
            //     if (typeof newdata[element] !== 'undefined') {
            //         //on modifie newdata qui contient les données actuelles de l'article
            //         // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
            //         newdata[element] = data[element];
            //     }
            // }
            data.categories.forEach(async (category) => {
                await ArticleHasCategory.updateById(category, id)
            });

            //je renvoie le jeu avec ses nouvelles informations en base de données
            // console.log(newdata);
            const result = await Article.updateById(data, id);

            response.json(result);
        }
        catch (err) {
            console.log(err);
            response.status(404).json(`L'article avec l'id ${id} n'existe pas ou a déjà était supprimé`);
        }
    }

};

module.exports = articleController;
