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
    }

};

module.exports = userController;