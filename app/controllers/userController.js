const { Article, Category, Size, User, Order, Address } = require('../models/index');
const sequelize = require('../database');
const { findOne } = require('../models/Article');
var validator = require("email-validator");
const bcrypt = require('bcrypt');

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
        const user_id = req.params.id;
        const users = await Address.findOne({
                    where: {user_id},
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
        const newUserData = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            phone_number: req.body.phoneNumber,
            role_id:req.body.roleId
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
                 
                
                    const infoUser= await User.findOne({
                                    where: { email: newUserData.email }, 
                                    attributes:{
                                                exclude:['password','role_id']
                                                }
                                    })

                    // les infos de l'address à ajouter

                    const newAddressData ={
                        country: req.body.country,
                        city: req.body.city,
                        zip_code: req.body.zipCode,
                        number: req.body.number,
                        street_name: req.body.streetName,
                        additional: req.body.additional,
                        user_id: infoUser.id
                        };
                        await Address.create(newAddressData);

                        console.log('infoUser : ',infoUser.id)

                        const userWithAddress = await User.findOne({
                            where:{ id : infoUser.id},
                            attributes:{
                                         exclude:['password','role_id','created_at','updated_at']
                            },
                            include:[
                                    {association:'user_has_address',
                                    attributes:{
                                                exclude:['user_id']}
                                    }
                            ],
                        })


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
        // comparer le password du form avec le hash de ka BDD
        // si c'est pas bon lui donner un message d'erreur
        // si c'est bon le connecter
        // persistance de la connexion => session

        // si on a des erreurs on rend la vue avec ces erreurs
        if (errors.length) {
            res.json({ errors });
        }
        // sinon on chercher l'utilisateur en BDD
        else {
            const user = await User.findOne({where:{email:req.body.email}})
           
                console.log('user :', user);

            // à partir d'ici, si on a un utilisateur, on le redirige sur la page d'accueil
            // si le user est null on redirige sur la page d'inscription 
            if (!user) {
                errors.push('Veuillez vérifier vos identifiants');
                
                res.json({ errors });
            }
            else {
                // si on a trouvé un utilisateur, il va falloir comparer le mdp
                // des données en post avec le hash de la BDD
                // pour faire ça bcrypt propose une fonction compareSync
                console.log('user :',user)
                const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
                console.log('isValidPassword : ', isValidPassword)

                // si le password est valide on va le redirier sur la page d'accueil et stocker ses infos => session
                // on va pouvoir masquer les liens du menu "se connecter" et "s'inscrire",
                // afficher son nom et le lien déconnecter
                if (isValidPassword) {
                    //maintenant que tout est validé on renvoit les informations demandées
                    const theuser = await Address.findOne({
                        where: {user_id:user.id},
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
                    res.json(theuser)
                }
                else {
                    errors.push('Veuillez vérifier vos identifiants');
                    res.json({ errors });
                }
            }
        }
    }
        
    }
module.exports = userController;