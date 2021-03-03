const { Router } = require('express');
const router = Router();

//validateur  prenant un schema Joi en argument en cas de requete body ou query  pour route post
// à passer en argument dans notre route post avant le controller
const { validateBody, validateQuery } = require('./services/validator');
//schema joi de contraintes avant insertions sql
const testSchema = require('./joiSchemas/testSchema');

const articleController = require('./controllers/articleController');

// ARTICLES
router.get('/articles', articleController.getAll);
router.get('/articles/:id', articleController.getById);
router.post('/articles', articleController.create);
router.patch('/articles/:id', articleController.updateById);
router.delete('/articles/:id', articleController.deleteById);



// A FAIRE 
// A FAIRE 
// A FAIRE
// retourne la page HOME - d'accueil
// router.get('/', mainController.homePage);




module.exports = router;