const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
const { findOne } = require('../models/user');

const userController = {

    getAll: async (request, response) => {
        try {
            const users = await User.findAll()
            response.json(users)
        }
        catch (err) {
            response.status(404).json(`Le user n'existe pas`);
        }
    },

    getOne: async (request, response) => {

        const id = request.params.id;

        try {
            const user = await User.findOne(id);
            response.json(user);
        }
        catch (err) {
            response.status(404).json(err.message);
        }
    },

    create: async (request, response) => {
        const newUserData = request.body;
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
        const isValidEmail = emailValidator.validate(newUserData.email);

        if (!isValidEmail) {
            errors.push('Vous devez renseigné un email valide');
        }

         // vérifier que le mot de passe soit assez long © Maher
        if (newUserData.password.length < 8) {
            errors.push('le mot de passe doit avoir au minimum 8 caractères');
         }

        // vérifier que le mdp soit égal à la confirmation
        if (newUserData.password !== newUserData.passwordConfirm) {
            errors.push('Le mot de passe et la confirmation doivent être identiques')
        }

        // si on a des erreurs, on rend la vue avec les erreurs
        if (errors.length) {
            response.json({errors});
        }
        else {
            // sinon on va chercher en bdd si on a un utilisateur avec le même email
            const user= await User.findByEmail(newUserData.email)
            console.log('ceci est le resultat de user',user)
             // si on trouve un user, on affiche une erreur
            if (user) {
                errors.push('Email déjà pris');
                response.json({errors});
             }

            else {
                const hashedPassword = bcrypt.hashSync(newUserData.password, 10);
                const newUser = new User({
                email: newUserData.email,
                firstname: newUserData.firstname,
                lastname: newUserData.lastname,
                password: hashedPassword,
                phone_number:newUserData.phone_number,
                role_id:newUserData.role_id
                 });

                 await newUser.insert();
                 response.json(newUser);
            }
        }
    },

    // Cette méthode remplace le nombre de  données choisis du jeu en question   
    updateById: async (request, response) => {

        //je récupère l'id pour vérifier que ce jeu existe bien grâce à la méthode findone()
        const { id } = request.params;

        // je récupère le body qui contient les modifications de notre enregistrement
        const data = request.body;

        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theUser = await User.findOne(id);
            console.log('user pour le patch bien trouvé');
            //par mesure de sécurité on supprime la possibilité de modifier l'id 
            if (data.id) {
                delete (data.id)
            }

            const newdata = theUser;

            // console.log('newdata de User: ', newdata);
            newdata.updated_at = "NOW()";

            for (const element in data) {
                if (typeof newdata[element] !== 'undefined') {
                    //on modifie newdata qui contient les données actuelles de l'user
                    // pour chaque clé correspondante on passe à newdata les nouvelles valeurs
                    newdata[element] = data[element];
                }
            }

            //je renvoie le jeu avec ses nouvelles informations en base de données
            const result = await theUser.updateById(newdata);
            // console.log('j envoie tout en BDD :', result);

            response.json(result);
        }
        catch (err) {
            response.status(404).json(`L'user avec l'id ${id} n'existe pas ou a déjà été supprimé`);
        }
    },

    deleteById: async (request, response) => {

        const { id } = request.params;
        try {
            // je vérifie que le jeu existe bien pour pouvoir ensuite le modifier 
            const theUser = await User.findOne(id);

            await theUser.deleteById();

            response.json(`L'user avec l'id ${id} a bien été supprimé`);
        }
        catch (err) {
            response.status(404).json(`L'user l'id ${id} n'existe pas ou a déjà été supprimé`);
        }
    },
    
    login: async (request,response)=>{

        console.log('request.body', request.body);

        const errors = [];
    
        // on vérifie que l'utilisateur a bien rempli les champs
        if (request.body.email.length === 0 || request.body.password.length === 0) {
          errors.push('Veuillez remplir tous les champs');
        }
    
        // vérifier que l'email existe en BDD => User
        // comparer le password du form avec le hash de ka BDD
        // si c'est pas bon lui donner un message d'erreur
        // si c'est bon le connecter
        // persistance de la connexion => session
        
        // si on a des erreurs on rend la vue avec ces erreurs
        if (errors.length) {
          response.json({errors});
        }
        // sinon on chercher l'utilisateur en BDD
        else {
         const user = await User.findByEmail(request.body.email)
          console.log('user :', user);
    
            // à partir d'ici, si on a un utilisateur, on le redirige sur la page d'accueil
            // si le user est null on redirige sur la page d'inscription 
            if (!user) {
              errors.push('Veuillez vérifier vos identifiants');
              response.json({errors});
            }
            else {
              // si on a trouvé un utilisateur, il va falloir comparer le mdp
              // des données en post avec le hash de la BDD
              // pour faire ça bcrypt propose une fonction compareSync
              const isValidPassword = bcrypt.compareSync(request.body.password, user[0].password);
              console.log('isValidPassword : ',isValidPassword)
              
              // si le password est valide on va le redirier sur la page d'accueil et stocker ses infos => session
              // on va pouvoir masquer les liens du menu "se connecter" et "s'inscrire",
              // afficher son nom et le lien déconnecter
              if (isValidPassword) {

                response.json(user)
              }
              else {
                errors.push('Veuillez vérifier vos identifiants');
                response.json({errors});
              }
            }
          
        }
      }
    

};

module.exports = userController;