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
    create: async (req, res) => {
        const articledata = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            phone_number: req.body.phoneNumber
        };
        const addressdata = {
            country: req.body.country,
            city: req.body.city,
            zip_code: req.body.zipCode,
            number: req.body.password,
            street_name: req.body.streetName,
            additional: req.body.additional

        };
        const article = await User.create(articledata);
        const address = await Address.create(addressdata);
        const newUser= [article,address]

        res.json(newUser);
    },

}
module.exports = userController;