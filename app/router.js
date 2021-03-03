const { Router } = require('express');
const router = Router();

//validateur  prenant un schema Joi en argument en cas de requete body ou query  pour route post
// à passer en argument dans notre route post avant le controller
const { validateBody, validateQuery } = require('./services/validator');
//schema joi de contraintes avant insertions sql
const testSchema = require('./joiSchemas/testSchema');

const articleController = require('./controllers/articleController');

// A VERIFIER !!!
// j'ai appelé category = singulier de categories en anglais
const categoryController = require('./controllers/categoryController');

// ARTICLES
router.get('/articles', articleController.getAllArticles);
router.get('/articles/:id', articleController.getOne);
router.post('/articles', articleController.create);
router.patch('/articles/:id', articleController.updateById);
router.delete('/articles/:id', articleController.deleteById);



// CATEGORIES
router.get('/categories', categoryController.getAll);
// A FAIRE 
// A FAIRE
// retourne la page HOME - d'accueil
// router.get('/', mainController.homePage);




module.exports = router;