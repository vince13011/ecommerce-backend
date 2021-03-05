const { response } = require('express');
const User = require('../models/user');

const userController = {

    getAll: async (request, response) => {
        try {
            const users = await User.findAll()
            response.json(users)
        }
        catch (err) {
            response.status(404).json(`Le user n'existe pas`);
        }
    },

    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const user = await User.findOne(id);
            response.json(user);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    create: async (request, response) => {
        const newUserData = request.body;

        const newUser = new User(newUserData);

        await newUser.insert();
        /* sans await, il va me manquer
         la certitude que tout s'est bien passé
         car la réponse sera envoyé avant la fin de l'enregistrement du jeu en base de données
        */
        response.json(newUser);
    },

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        const data = request.body;

        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theUser = await User.findOne(id);
            console.log('user pour le patch bien trouvé');
            //par mesure de sécurité on supprime la possibilité de modifier l'id 
            if (data.id) {
                delete (data.id)
            }

            const newdata = theUser;

            // console.log('newdata de User: ', newdata);
            newdata.updated_at = "NOW()";

            for (const element in data) {
                if (typeof newdata[element] !== 'undefined') {
                    //on modifie newdata qui contient les données actuelles de l'user
                    // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
                    newdata[element] = data[element];
                }
            }

            //je renvoie le jeu avec ses nouvelles informations en base de données
            const result = await theUser.updateById(newdata);
            // console.log('j envoie tout en BDD :', result);

            response.json(result);
        }
        catch (err) {
            response.status(404).json(`L'user avec l'id ${id} n'existe pas ou a déjà été supprimé`);
        }
    },

    deleteById: async (request, response) => {

        const { id } = request.params;
        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theUser = await User.findOne(id);

            await theUser.deleteById();

            response.json(`L'user avec l'id ${id} a bien été supprimé`);
        }
        catch (err) {
            response.status(404).json(`L'user l'id ${id} n'existe pas ou a déjà été supprimé`);
        }
    },

};

module.exports = userController;