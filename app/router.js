const { Router } = require('express');
const router = Router();

// validateur  prenant un schema Joi en argument en cas de requete body ou query  pour route post
// à passer en argument dans notre route post avant le controller
const { validateBody, validateQuery } = require('./services/validator');
// schema joi de contraintes avant insertions sql
const testSchema = require('./joiSchemas/testSchema');

// CONTROLLERS
const articleController = require('./controllers/articleController');
const categoryController = require('./controllers/categoryController');
const orderController = require('./controllers/orderController');
const userController = require('./controllers/userController');
const addressController = require('./controllers/addressController');
const sizeController = require('./controllers/sizeController');
const articleHasCategoryController = require('./controllers/articleHasCategoryController');

const articleHasSizeController = require ('./controllers/articleHasSizeController')
const orderHasArticleController = require ('./controllers/orderHasArticleController')


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
router.delete('/categories/:id', categoryController.deleteById);

// ORDERS
router.get('/orders', orderController.getAll);
router.get('/orders/:id', orderController.getOne);
router.post('/orders', orderController.create);
router.patch('/orders/:id', orderController.updateById);
router.delete('/orders/:id', orderController.deleteById);

// USERS
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getOne);
// *******************************************
// connecter un user ???
// *******************************************
// router.post('/users', userController.create);
router.patch('/users/:id', userController.updateById);
router.delete('/users/:id', userController.deleteById);


// CREER UN NOUVEL UTILISATEUR
router.post('/signup', userController.create);


// ADDRESSES
router.get('/addresses', addressController.getAll);
router.get('/addresses/:id', addressController.getOne);
router.post('/addresses', addressController.create);
router.patch('/addresses/:id', addressController.updateById);
router.delete('/addresses/:id', addressController.deleteById);


// SIZES
router.get('/sizes', sizeController.getAll);
router.get('/sizes/:id', sizeController.getOne);
router.post('/sizes', sizeController.create);
router.patch('/sizes/:id', sizeController.updateById);
router.delete('/sizes/:id', sizeController.deleteById);


// ARTICLE_HAS_CATEGORY
router.get('/category/article', articleHasCategoryController.getAll);
router.get('/category/:id/article', articleHasCategoryController.getAllInCategory);
router.post('/category/article', articleHasCategoryController.create);

// ARTICLE_HAS_SIZE
router.get('/size/article', articleHasSizeController.getAll);
router.get('/size/:id/article', articleHasSizeController.getAllInSize);
router.post('/size/article', articleHasSizeController.create);

// ORDER_HAS_ARTICLE
router.get('/order/article', orderHasArticleController.getAll);
router.get('/order/:id/article', orderHasArticleController.getAllInOrder);
router.post('/order/article', orderHasArticleController.create);

// ROUTER
module.exports = router;