const { Article, Category, Size, User, Order, Address } = require('../models/index');
const sequelize = require('../database');

const userController = {
    getAll: async (req, res) =>{
        const {limit} = req.query;
        const users = await User.findAll({
            attributes:{
                exclude:['password','created_at','updated_at']
            },
            include :[{
                association:'user_has_address',
                attributes:{
                    exclude:['created_at','updated_at'],
                    include:[{
                        association:'address_orders',
                        exclude:['created_at','updated_at']
                        /*
                        include:[{
                            association:'orderArticles',
                            exclude:['created_at','updated_at'] 
                        }]*/
                    }]
                },
            }]
            
         })
          res.json(users);
     }

}
module.exports = userController;