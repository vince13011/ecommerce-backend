const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const addressController = {
    // renvoi toutes les address avec chacun de leur user
    getAll: async (req, res) => {
        const { limit } = req.query;
        const addresses = await Address.findAll({

            include: [
                {
                    association: 'address_user',
                }
            ]
        });
        res.json(addresses);
    },

    // renvoi une address et son user
    getOne: async (req, res) => {
        const { id } = req.params;
        const address = await Address.findByPk(id, {
            include: [
                {
                    association: 'address_user',
                }
            ]
        })
        if (!address) {
            res.status(400).json(`l'addresse avec le user_id ${user_id} n'existe pas`);
            return next();
        }
        res.json(address);
    },

    //cette fonction créée une addresse en fonction de son user id et la retourne 
    create: async (req, res) => {

        const newAddressData = {
            country: req.body.country,
            city: req.body.city,
            zip_code: req.body.zipCode,
            number: req.body.number,
            street_name: req.body.streetName,
            additional: req.body.additional,
            firstname_address: req.body.firstNameAddress,
            lastname_address: req.body.lastNameAddress,
            user_id: req.body.userId
        };
        const newAddress = await Address.create(newAddressData);
        const theAddressUser = await Address.findOne({
            where: { id: newAddress.id },
            attributes: {
                exclude: ['created_at']
            }
        });

        res.json(theAddressUser);

    },

    // modification d'une address en fonction de son id
    updateById: async (req, res) => {
        const { id } = req.params;
        const newAddressData = {
            country: req.body.country,
            city: req.body.city,
            zip_code: req.body.zipCode,
            number: req.body.number,
            street_name: req.body.streetName,
            additional: req.body.additional,
            firstname_address: req.body.firstNameAddress,
            lastname_address: req.body.lastNameAddress,
            user_id: req.body.userId
        };
        console.log('data renvoyée:', newAddressData)

        await Address.update({ ...newAddressData }, { where: { id } })
        const newAddress = await Address.findByPk(id)
        res.json(newAddress)
    },

    // Suppression d'une addresse en fonction de son id
    deleteById: async (req, res) => {
       
            const { id } = req.params;
            const address = await Address.findByPk(id);
            if (!address) {
                res.status(400).json(`l'addresse avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next();
            }

            const user = await Address.findByPk(id);
            Address.destroy({ where: { id } })

            const addressExist = await Address.findByPk(id);
            if (addressExist) {
                res.status(400).json(`l'addresse avec l'id ${id} n'as pas était supprimé`);
            };
            res.json(`l'addresse avec l'id ${id} est bien supprimé`);
        }

}
module.exports = addressController;