const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const addressController = {
// return all the addresses with each of their user
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

    // return an address and his user
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

    // this function creates an address according to its user id and returns it
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

  // updating of an address according to its id
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

    // Delete an address based on its id
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