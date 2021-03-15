const { Article, Category, Size, User, Order, Address, ArticleHasSize } = require('../models/index');
const sequelize = require('../database');

const addressController = {
    // renvoi toutes les address avec chacune leur user
    getAll: async (req, res) => {
        const { limit } = req.query;
        const addresses = await Address.findAll({
            // attributes: {
            //     exclude: ['created_at', 'updated_at']
            // },
            include: [
                {
                    association: 'address_user',
                }
            ]

        })
        res.json(addresses);
    },

    // renvoi l'address avec son user
    getOne: async (req, res) => {
        const user_id = req.params.id;
        const address = await Address.findByPk(user_id, {
            include: [
                {
                    association: 'address_user',
                }
            ]
        })
        res.json(address);
    },

    
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
        console.log('newaddressdata :',newAddressData)
        const newAddress=await Address.create(newAddressData);
        console.log('newaddress :',newAddress)

        const theAddressUser = await Address.findOne({
            where: { id: newAddress.id },
            attributes: {
                exclude: ['created_at']
            },
            include: [{
                association: 'address_orders',
                include: [{
                    association: 'orderArticles',
                    order: [
                        ['updated_at', 'ASC']
                    ]
                }]
            }]

        })

        res.json(theAddressUser)
    
    },
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
        console.log('data renvoyée:',newAddressData)
        //const oldUser = await Address.findOne({where:{id}});
        await Address.update({...newAddressData }, { where: { id } })
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
            res.json(`l'addresse avec l'id ${id} n'a pas pu être supprimé ou n'existe pas`)
        }
    }
    
}
module.exports = addressController;