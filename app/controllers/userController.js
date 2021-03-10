const { Article, Category, Size, User, Order, Address } = require('../models/index');
const sequelize = require('../database');

const userController = {
    getAll: async (req, res) =>{
        const {limit} = req.query;
        const users = await Address.findAll({
           attributes:{
               exclude:['created_at']
           },
                include:[
                    {association:'address_user',
                        attributes:{
                        exclude:['password','created_at']}
                    },
                    {association:'address_orders'}
           ]
            
         })
          res.json(users);
     }

}
module.exports = userController;