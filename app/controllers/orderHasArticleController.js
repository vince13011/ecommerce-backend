const OrderHasArticle = require('../models/orderHasArticle');

const orderHasArticleController = {

    // get all associations between order and articles
    getAll: async (request, response) => {
        try {
            const orderHasArticle = await OrderHasArticle.findAll()
            response.json(orderHasArticle)
        }
        catch (err) {
            response.status(404).json(`L'orderHasArticle n'existe pas`);
        }
    },

    getAllInOrder: async (request, response) => {
        const id = request.params.id;
        try {
            const orderHasArticle = await OrderHasArticle.findAllInOrder(id);
            response.json(orderHasArticle);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    // create an association between order and article
    create: async (request, response) => {
        const newOrderHasArticleData = request.body;
        const newOrderHasArticle = new OrderHasArticle(newOrderHasArticle);
        await newOrderHasArticle.insert();
        response.json(newOrderHasArticle);
    },


};


module.exports = orderHasArticleController;