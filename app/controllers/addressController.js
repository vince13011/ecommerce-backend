const { response } = require('express');
const Address = require('../models/address');

const addressController = {

    getAll: async (request, response) => {
        try {
            const addresss = await Address.findAll()
            response.json(addresss)
        }
        catch (err) {
            response.status(404).json(`L'address n'existe pas`);
        }
    },
    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const address = await Address.findOne(id);
            response.json(address);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    create: async (request, response) => {
        // les infos de l'address à ajouter
        const newAddressData = request.body;
        console.log('type of user_id',typeof(request.body.user_id))
         console.log('newAddressdata: ', newAddressData)
        const newAddress = new Address(newAddressData);
        console.log('newAddress: ', newAddress)

        await newAddress.insert();

        response.json(newAddress);
    },

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        const data = request.body;

        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theAddress = await Address.findOne(id);

            //par mesure de sécurité on supprime la possibilité de modifier l'id 
            if (data.id) {
                delete (data.id)
            }

            const newdata = theAddress;

            console.log('newdata: ', newdata)
            newdata.updated_at = "NOW()";

            for (const element in data) {
                if (typeof newdata[element] !== 'undefined') {
                    //on modifie newdata qui contient les données actuelles de l'address
                    // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
                    newdata[element] = data[element];
                }
            }

            //je renvoie le jeu avec ses nouvelles informations en base de données
            const result = await theAddress.updateById(newdata);

            response.json(result);
        }
        catch (err) {
            response.status(404).json(`L'address avec l'id ${id} n'existe pas ou a déjà était supprimé`);
        }
    }

};

module.exports = addressController;
