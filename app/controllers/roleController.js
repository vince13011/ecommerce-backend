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

};

module.exports = userController;