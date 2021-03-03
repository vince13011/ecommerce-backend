const { Router } = require('express');
const router = Router();

// validateur  prenant un schema Joi en argument en cas de requete body ou query  pour route post
// à passer en argument dans notre route post avant le controller
const { validateBody, validateQuery } = require('./services/validator');
// schema joi de contraintes avant insertions sql
const testSchema = require('./joiSchemas/testSchema');

// import controllers
const articleController = require('./controllers/articleController');
const categoryController = require('./controllers/categoryController');
const orderController = require('./controllers/orderController');
const userController = require('./controllers/userController');

// HOME
// router.get('/', mainController.homePage);

// ARTICLES
router.get('/articles', articleController.getAll);
router.get('/articles/:id', articleController.getOne);
router.post('/articles', articleController.create);
router.patch('/articles/:id', articleController.updateById);
router.delete('/articles/:id', articleController.deleteById);

// CATEGORIES
router.get('/categories', categoryController.getAll);
router.get('/categories/:id', categoryController.getOne);
router.post('/categories', categoryController.create);
router.patch('/categories/:id', categoryController.updateById);
// router.delete('/categories/:id', categoryController.deleteById);

// ORDERS
router.get('/orders', orderController.getAll);
router.get('/orders/:id', orderController.getOne);
// router.post('/orders', categoryController.create);
// router.patch('/orders/:id', categoryController.updateById);
// router.delete('/orders/:id', categoryController.deleteById);

// USERS
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getOne);
// connecter un user ???
// router.post('/users', userController.create);

// router.patch('/users/:id', userController.updateById);
// router.delete('/users/:id', userController.deleteById);





module.exports = router;