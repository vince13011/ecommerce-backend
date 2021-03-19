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
        console.log('newaddressdata :', newAddressData)
        const newAddress = await Address.create(newAddressData);
        console.log('newaddress :', newAddress)

        const theAddressUser = await Address.findOne({
            where: { id: newAddress.id },
            attributes: {
                exclude: ['created_at']
            }
        });

        res.json(theAddressUser);

    },

    //on modifie un enregistrement on fonction de son id
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
        //const oldUser = await Address.findOne({where:{id}});
        await Address.update({ ...newAddressData }, { where: { id } })
        const newUser = await Address.findByPk(id)
        res.json(newUser)
    },
    deleteById: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('id:', id)
            const user = await Address.findByPk(id);
            Address.destroy({ where: { id } })
            //await user.destroy();
            res.json(`l'addresse avec l'id ${id} est bien supprimé`)
        }
        catch {
            res.status(400).json(`l'addresse avec l'id ${id} n'a pas pu être supprimé ou n'existe pas`)
        }
    }

}
module.exports = addressController;