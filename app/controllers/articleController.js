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
    },

    create: async (request, response) => {
        // les infos de l'article à ajouter
        const newArticleData = request.body;

        const newArticle = new Article(newArticleData);

        await newArticle.insert();

        /* sans await, il va me manquer
         la certitude que tout s'est bien passé
         car la réponse sera envoyé avant la fin de l'enregistrement du jeu en base de données
        */
        response.json(newGame);
    },

    deleteById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;
        try {

            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theArticle = await Article.findOne(id);


            await theArticle.deleteById();

            response.json(`L'article avec l'id ${id} a bien était supprimé`);
        }
        catch (err) {
            response.status(404).json(`L'artcle l'id ${id} n'existe pas ou a déjà était supprimé`);
        }
    },

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        const data = request.body;

        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theArticle = await Article.findOne(id);

            //par mesure de sécurité on supprime la possibilité de modifier l'id 
            if (data.id) {
                delete (data.id)
            }

            const newdata = theArticle;

            //ici on compare les données du jeu avec les futurs modifications

            for (const element in data) {
                if (typeof newdata[element] !== 'undefined') {
                    //on modifie newdata qui contient les données actuelles de l'article
                    // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
                    newdata[element] = data[element];
                }
            }

            //je renvoie le jeu avec ses nouvelles informations en base de données
            const result = await theArticle.updateById(newdata);

            response.json(result);
        }
        catch (err) {
            response.status(404).json(`L'article avec l'id ${id} n'existe pas ou a déjà était supprimé`);
        }
    }

};

module.exports = articleController;
