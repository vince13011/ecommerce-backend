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

    /*
    create: async (req, res) => {
        const newUserData = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            phone_number: req.body.phoneNumber,
            role_id: req.body.roleId
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
            const user = await Address.findOne({ where: { email: newUserData.email } })
            console.log('ceci est le resultat de user', user)
            // si on trouve un user, on affiche une erreur
            if (user) {
                errors.push('Email déjà pris');
                res.json({ errors });
            }

            else {
                const hashedPassword = bcrypt.hashSync(newUserData.password, 10);
                newUserData.password = hashedPassword;

                await Address.create(newUserData);

                const infoUser = await Address.findOne({
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

                const user = await Address.findOne({
                    where: { id: infoUser.id },
                    attributes: { exclude: ['role_id', 'password', 'created_at', 'updated_at'] }
                })
                const userWithAddress = [user, theAddressUser];
                res.json(userWithAddress)
            }
        }
    },

    updateById: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        //const oldUser = await Address.findOne({where:{id}});
        await Address.update({ ...data }, { where: { id } })
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
            res.json(`l'utilisateur avec l'id ${id} est bien supprimé`)
        }
        catch {
            res.json(`l'utilisateur avec l'id ${id} n'a pas pu être supprimé ou n'existe pas`)
        }
    }
    */
}
module.exports = addressController;