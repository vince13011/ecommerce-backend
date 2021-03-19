const { Article, Category, Size, User, Order, Address } = require('../models/index');
const sequelize = require('../database');
const jwtUtils = require('../services/jwt.utils')
const validator = require("email-validator");
const bcrypt = require('bcrypt');

const userController = {
  
    //renvoi tout les users
    getAll: async (req, res) => {
        const { limit } = req.query;
        const users = await User.findAll({
            attributes: {
                exclude: ['id', 'password', 'created_at', 'role_id']
            }
        })
        res.json(users);
    },


    //renvoi un user -> ses addresses -> ses commandes -> le contenu de ses commandes
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

    //création d'un user
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

        // on crée un tableau d'erreurs qu'on viendra remplir si un des tests
        // qu'on va faire ne passe pas
        const errors = [];

        // on teste si la valeur de firstname n'est pas une chaine de carctère vide
        if (newUserData.firstname.length === 0) {
            errors.push('Le prénom doit être renseigné')
        }

        // on teste si la valeur de lastname n'est pas une chaine de carctère vide
        if (newUserData.lastname.length === 0) {
            errors.push('Le nom doit être renseigné')
        }

        // grâce à email-validator on vient vérifier que notre email est bien
        // valide
        const isValidEmail = validator.validate(newUserData.email);

        if (!isValidEmail) {
            errors.push('Vous devez renseigné un email valide');
        }

        // vérifier que le mot de passe soit assez long © Maher
        if (newUserData.password.length < 8) {
            errors.push('le mot de passe doit avoir au minimum 8 caractères');
        }

        // vérifier que le mdp soit égal à la confirmation
        if (newUserData.password !== req.body.passwordConfirm) {
            errors.push('Le mot de passe et la confirmation doivent être identiques')
        }

        // si on a des erreurs, on rend la vue avec les erreurs
        if (errors.length) {
            res.json({ errors });
        }
        else {
            // sinon on va chercher en bdd si on a un utilisateur avec le même email
            const user = await User.findOne({ where: { email: newUserData.email } })
            console.log('ceci est le resultat de user', user)
            // si on trouve un user, on affiche une erreur
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

                // les infos de l'address à ajouter
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

        // on vérifie que l'utilisateur a bien rempli les champs
        if (req.body.email.length === 0 || req.body.password.length === 0) {
            errors.push('Veuillez remplir tous les champs');
        }

        // vérifier que l'email existe en BDD => User
        // comparer le password du formulaire avec le hash de la BDD
        // si c'est pas bon lui donner un message d'erreur
        // si c'est bon le connecter

        // si on a des erreurs on rend la vue avec ces erreurs
        if (errors.length) {
            res.json({ errors });
        }
        // sinon on chercher l'utilisateur en BDD
        else {
            const user = await User.findOne({ where: { email: req.body.email } })

            console.log('user :', user);

            // à partir d'ici, si on a un utilisateur, on le redirige sur la page d'accueil
            // si le user est null on redirige sur la page d'inscription 
            if (!user) {
                errors.push('Vérifiez vos identifiants');

                res.json({ errors });
            }
            else {
                // si on a trouvé un utilisateur, il va falloir comparer le mdp
                // des données en post avec le hash de la BDD
                // pour faire ça bcrypt propose une fonction compareSync
                console.log('user :', user)
                const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
                console.log('isValidPassword : ', isValidPassword)

   
                if (isValidPassword) {

                     //maintenant que tout est validé on renvoit les informations demandées 
                    const infoUser = await User.findOne({
                        where: { id: user.id },
                        attributes: {
                            exclude: ['password', 'created_at', 'updated_at']
                        },
                        include: [{ association: 'user_has_role' }]

                    })
                    console.log('infouser role id: ', infoUser.role_id)

                    //on envoie un token à l'utilisateur qu'il devra nous renvoyer sur certaines routes nécéssitant une autorisation
                    //en fonction du role de l'utilisateur on revoie un token avec une signature différente
                   //user
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

    //on modifie une addresse
    updateById: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        
        //on vérifie que le user existe
        const verification = await User.findByPk(id)

        if (!verification) {
            res.status(400).json(`le user avec l'id ${id} n'existe pas`);
            return next();
        }


        //const oldUser = await User.findOne({where:{id}});
        await User.update({ ...data }, { where: { id } })
        const newUser = await User.findByPk(id)
        res.json(newUser)
    },

    //suppression d'un user
    deleteById: async (req, res) => {
        
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                res.status(400).json(`le user avec l'id ${id} n'existe pas et ne peut donc pas être supprimé`);
                return next()
            }

            User.destroy({ where: { id } })

                //si le user existe toujours on renvoie une erreur
                const userExist = await User.findByPk(id);
                if (userExist) {
                    res.status(400).json(`le user avec l'id ${id} n'a pas était supprimé`);
                };
          
            res.json(`le user avec l'id ${id} est bien supprimé`)

        
    }
}
module.exports = userController;