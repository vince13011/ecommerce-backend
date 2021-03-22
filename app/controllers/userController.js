const { Article, Category, Size, User, Order, Address } = require('../models/index');
const sequelize = require('../database');
const jwtUtils = require('../services/jwt.utils')
const validator = require("email-validator");
const bcrypt = require('bcrypt');

const userController = {
  
    //return all users
    getAll: async (req, res) => {
        const { limit } = req.query;
        const users = await User.findAll({
            attributes: {
                exclude: ['id', 'password', 'created_at', 'role_id']
            }
        })
        res.json(users);
    },


   // returns a user -> his addresses -> his orders -> the content of his orders
    getOne: async (req, res) => {
        const { id } = req.params;
        const headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0) {
            let userId = jwtUtils.getAdminId(headerAuth);
            if (userId < 0) {
                return res.status(400).json({ 'error': 'token absent' });
            }
        }


        const infoUser = await User.findOne({
            where: { id },
            attributes: {
                exclude: ['role_id', 'password', 'created_at', 'updated_at']
            },
            include: [{ association: 'user_has_role' }]
        })

        if (!infoUser) {
            res.status(400).json(`aucun compte avec l'id ${id}`)
        }

        const theAddressUser = await Address.findOne({
            where: { user_id: infoUser.id },
            attributes: {
                exclude: ['created_at']
            },
            include: [
                {
                    association: 'address_orders',
                    include: [{
                        association: 'orderArticles',
                        order: [
                            ['updated_at', 'ASC']
                        ]
                    }]
                }
            ]
        })

        const userWithAddress = [infoUser, theAddressUser];
        res.json(userWithAddress)


    },

    // create a user
    create: async (req, res) => {
        const newUserData = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            phone_number: req.body.phoneNumber
        }

        if (req.body.roleId) {
            newUserData.role_id = req.body.roleId;
        };

        // we create an array of errors that we will fill in if one of the tests
        // we are going to do not pass
        const errors = [];

        // we test if the value of firstname is not an empty string
        if (newUserData.firstname.length === 0) {
            errors.push('Le prénom doit être renseigné')
        }

        // we test if the value of lastname is not an empty string
        if (newUserData.lastname.length === 0) {
            errors.push('Le nom doit être renseigné')
        }

        // thanks to email-validator we can check that our email is valid
        const isValidEmail = validator.validate(newUserData.email);

        if (!isValidEmail) {
            errors.push('Vous devez renseigné un email valide');
        }

        // check that the password is long enough
        if (newUserData.password.length < 8) {
            errors.push('le mot de passe doit avoir au minimum 8 caractères');
        }

        // check that the password is equal to the confirmation 
        if (newUserData.password !== req.body.passwordConfirm) {
            errors.push('Le mot de passe et la confirmation doivent être identiques')
        }


        // if we have errors, we return the view with the errors
        if (errors.length) {
            res.json({ errors });
        }
        else {
            // otherwise we will search in database if we have a user with the same email 
           const user = await User.findOne({ where: { email: newUserData.email } })
            console.log('ceci est le resultat de user', user)
            // if we find a user, we display an error
            if (user) {
                errors.push('Email déjà pris');
                res.json({ errors });
            }

            else {
                const hashedPassword = bcrypt.hashSync(newUserData.password, 10);
                newUserData.password = hashedPassword;


                await User.create(newUserData);

                const infoUser = await User.findOne({
                    where: { email: newUserData.email },
                    attributes: {
                        exclude: ['password', 'role_id']
                    }
                })


                // the address information to add
                const newAddressData = {
                    country: req.body.country,
                    city: req.body.city,
                    zip_code: req.body.zipCode,
                    number: req.body.number,
                    street_name: req.body.streetName,
                    additional: req.body.additional,
                    user_id: infoUser.id
                };

                await Address.create(newAddressData);

                const theAddressUser = await Address.findOne({
                    where: { user_id: infoUser.id },
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

                const user = await User.findOne({
                    where: { id: infoUser.id },
                    attributes: { exclude: ['password', 'created_at', 'updated_at'] },
                    include: [{ association: 'user_has_role' }]

                })

                const userWithAddress = [user, theAddressUser];
                res.json(userWithAddress)
            }
        }
    },


    login: async (req, res) => {

        console.log('req.body', req.body);

        const errors = [];

        // we check that the user has correctly filled in the fields
        if (req.body.email.length === 0 || req.body.password.length === 0) {
            errors.push('Veuillez remplir tous les champs');
        }

        // check that the email exists in BDD => User
        // compare the password of the form with the hash of the database
        // if it's not good give it an error message
        // if it's good to connect it

        // if we have errors we return the view with these errors
        if (errors.length) {
            res.json({ errors });
        }
        // otherwise we look for the user in DB
        else {
            const user = await User.findOne({ where: { email: req.body.email } })

            console.log('user :', user);

            // from here, if we have a user, we redirect them to the home page
            // if the user is null we redirect to the registration page
            if (!user) {
                errors.push('Vérifiez vos identifiants');

                res.json({ errors });
            }
            else {
               // if we have found a user, we will have to compare the password
                // data in post with the hash of the database
                // to do that bcrypt proposes a compareSync function
                console.log('user :', user)
                const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
                console.log('isValidPassword : ', isValidPassword)

   
                if (isValidPassword) {

                    // now that everything is validated, we return the requested information
                    const infoUser = await User.findOne({
                        where: { id: user.id },
                        attributes: {
                            exclude: ['password', 'created_at', 'updated_at']
                        },
                        include: [{ association: 'user_has_role' }]

                    })
                    console.log('infouser role id: ', infoUser.role_id)

                    // we send a token to the user that he will have to send back to us on certain routes requiring authorization
                    // depending on the role of the user, we return a token with a different signature
                    // user
                    if (infoUser.role_id === 2) {
                        const token = jwtUtils.generateTokenForUser(user);
                        const userWithAddress = [token, user.id];
                        res.json(userWithAddress);
                    }
                    
                    //Admin
                    if (infoUser.role_id === 1) {
                        const token = jwtUtils.generateTokenForAdmin(user);
                        const userWithAddress = [token, user.id];
                        res.json(userWithAddress);
                    }


                }
                else {
                    errors.push('Vérifiez vos identifiants');
                    res.json({ errors });
                }
            }
        }
    },

    //we update an address
    updateById: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        
        // we check that this user exists
        const verification = await User.findByPk(id)

        if (!verification) {
            res.status(400).json(`le user avec l'id ${id} n'existe pas`);
            return next();
        }

        await User.update({ ...data }, { where: { id } })
        const newUser = await User.findByPk(id)
        res.json(newUser)
    },

    //delete an user
    deleteById: async (req, res) => {
        
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                res.status(400).json(`le user avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next()
            }

            User.destroy({ where: { id } })

// if the user still exists, we return an error                const userExist = await User.findByPk(id);
                if (userExist) {
                    res.status(400).json(`le user avec l'id ${id} n'a pas était supprimé`);
                };
          
            res.json(`le user avec l'id ${id} est bien supprimé`)

        
    }
}
module.exports = userController;