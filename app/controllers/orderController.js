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

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        const data = request.body;

        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theOrder = await Order.findOne(id);

            //par mesure de sécurité on supprime la possibilité de modifier l'id 
            if (data.id) {
                delete (data.id)
            }

            const newdata = theOrder;

            console.log('newdata: ', newdata)
            newdata.updated_at = "NOW()";

            for (const element in data) {
                if (typeof newdata[element] !== 'undefined') {
                    //on modifie newdata qui contient les données actuelles de l'article
                    // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
                    newdata[element] = data[element];
                }
            }

            //je renvoie le jeu avec ses nouvelles informations en base de données
            const result = await theOrder.updateById(newdata);

            response.json(result);
        }
        catch (err) {
            response.status(404).json(`L'order avec l'id ${id} n'existe pas ou a déjà était supprimé`);
        }
    }

};

module.exports = orderController;