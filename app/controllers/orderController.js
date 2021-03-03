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
    }

};

module.exports = orderController;