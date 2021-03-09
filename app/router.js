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

const articleHasSizeController = require('./controllers/articleHasSizeController')
const orderHasArticleController = require('./controllers/orderHasArticleController')


// ARTICLES
router.get('/articles', articleController.getAll);
router.get('/article/:id', articleController.getOne);
router.post('/article', articleController.create);
router.put('/article/:id', articleController.updateById);
router.delete('/article/:id', articleController.deleteById);

// CATEGORIES
router.get('/categories', categoryController.getAll);
router.get('/category/:id', categoryController.getOne);
router.post('/category', categoryController.create);
router.put('/category/:id', categoryController.updateById);
router.delete('/category/:id', categoryController.deleteById);

// ORDERS
router.get('/orders', orderController.getAll);
router.get('/order/:id', orderController.getOne);
router.post('/order', orderController.create);
router.put('/order/:id', orderController.updateById);
router.delete('/order/:id', orderController.deleteById);

// USERS
router.get('/users', userController.getAll);
router.get('/user/:id', userController.getOne);
router.post('/user', userController.login);
router.put('/user/:id', userController.updateById);
router.delete('/user/:id', userController.deleteById);


// CREER UN NOUVEL UTILISATEUR
router.post('/signup', userController.create);


// ADDRESSES
router.get('/addresses', addressController.getAll);
router.get('/address/:id', addressController.getOne);
router.post('/address', addressController.create);
router.put('/address/:id', addressController.updateById);
router.delete('/address/:id', addressController.deleteById);


// SIZES
router.get('/sizes', sizeController.getAll);
router.get('/size/:id', sizeController.getOne);
router.post('/size', sizeController.create);
router.put('/size/:id', sizeController.updateById);
router.delete('/size/:id', sizeController.deleteById);


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