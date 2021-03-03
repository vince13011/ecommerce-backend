const { response } = require('express');
const Order = require('../models/order');

const orderController = {

    getAll: async (request, response) => {
        try {
            const orders = await Order.findAll()
            response.json(orders)
        }
        catch (err) {
            response.status(404).json(`L'order n'existe pas`);
        }
    },

    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const order = await Order.findOne(id);
            response.json(order);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    create: async (request, response) => {
        // les infos de l'article à ajouter
        const newOrderData = request.body;

        // console.log('newOrderdata: ', newOrderData)
        const newOrder = new Order(newOrderData);
        // console.log('newOrder: ', newOrder)

        await newOrder.insert();

        /* sans await, il va me manquer
         la certitude que tout s'est bien passé
         car la réponse sera envoyé avant la fin de l'enregistrement du jeu en base de données
        */
        response.json(newOrder);
    },

};

module.exports = orderController;