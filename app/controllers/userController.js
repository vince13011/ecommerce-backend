const { Article, Category, Size, User, Order, Address } = require('../models/index');
const sequelize = require('../database');

const userController = {
    //renvoi tout les  user -> ses addresses -> ses commandes -> le contenu de ses commandes
    /* getAll: async (req, res) =>{
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
                    {association:'address_orders',
                            include:[{
                                association:'orderArticles'
                            }]
                    }
                 ]  
         })
          res.json(users);
     },
*/

    getAll: async (req, res) =>{
        const {limit} = req.query;
        const users = await User.findAll({
           attributes:{
               exclude:['id','password','created_at','role_id']
           } 
         })
          res.json(users);
     },

     //renvoi un user -> ses addresses -> ses commandes -> le contenu de ses commandes
     getOne: async (req, res) =>{
        const {id} = req.params;
        const users = await Address.findOne({
                    where: {id},
                    attributes:{
                        exclude:['created_at']
                    },
                        include:[
                            {association:'address_user',
                                attributes:{
                                exclude:['password','created_at']}
                            },
                            {association:'address_orders',
                                    include:[{
                                        association:'orderArticles',
                                        order: [
                                            ['updated_at', 'ASC']
                                        ]
                                    }]
                            }
                            ]  
                            
                    })
                    res.json(users);
                },


}
module.exports = userController;