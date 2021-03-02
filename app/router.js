const {Router} = require('express');
const router = Router();

//validateur  prenant un schema Joi en argument en cas de requete body ou query  pour route post
// à passer en argument dans notre route post avant le controller
const { validateBody,validateQuery} = require('./services/validator');
//schema joi de contraintes avant insertions sql
const testSchema = require('./joiSchemas/testSchema');

const articleController = require('./controllers/articleController');


router.get('/articles',articleController.getAll)

module.exports = router;