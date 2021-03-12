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
const sizeController = require('./controllers/sizeController');
const articleHasSizeController = require('./controllers/articleHasSizeController');
const orderHasArticleController = require('./controllers/orderHasArticleController');
const orderController = require('./controllers/orderController');
const userController = require('./controllers/userController');
const addressController = require('./controllers/addressController');
const articleHasCategoryController = require('./controllers/articleHasCategoryController');
const payController = require('./controllers/payController');



// ARTICLES
router.get('/articles', articleController.getAll);
router.get('/article/:id', articleController.getOne);
router.post('/article', articleController.create);
router.put('/article/:id', articleController.update);
router.delete('/article/:id', articleController.delete);

// // CATEGORIES
router.get('/categories', categoryController.getAll);
router.get('/category/:id', categoryController.getOne);
router.post('/category', categoryController.create);
router.patch('/category/:id', categoryController.update);
router.delete('/category/:id', categoryController.delete);

// ORDERS
router.get('/orders', orderController.getAll);
router.get('/order/:id', orderController.getOne);
router.post('/order', orderController.create);

// // USERS
router.get('/users', userController.getAll);
router.get('/user/:id', userController.getOne);

// // connecter un user ???
router.post('/user', userController.login);
router.put('/user/:id', userController.updateById);
router.delete('/user/:id', userController.deleteById);


// // CREER UN NOUVEL UTILISATEUR
router.post('/signup', userController.create);


// // ADDRESSES
router.get('/addresses', addressController.getAll);
router.get('/address/:id', addressController.getOne);
// router.post('/addresses', addressController.create);
// router.put('/addresses/:id', addressController.updateById);
// router.delete('/addresses/:id', addressController.deleteById);


// // SIZES
router.get('/sizes', sizeController.getAll);
router.get('/size/:id', sizeController.getOne);
router.post('/sizes', sizeController.create);
router.patch('/size/:id', sizeController.update);
router.delete('/size/:id', sizeController.delete);


// // ARTICLE_HAS_CATEGORY
router.get('/article-has-category', articleHasCategoryController.getAll);
router.get('/article-has-category/:id', articleHasCategoryController.getOne);
router.get('/article-has-category/:id', articleHasCategoryController.delete);

// // ARTICLE_HAS_SIZE
router.get('/article-has-size', articleHasSizeController.getAll);
router.get('/article-has-size/:id', articleHasSizeController.getOne);
router.post('/article-has-size/:id', articleHasCategoryController.delete);

// // ORDER_HAS_ARTICLE
router.get('/order-has-article', orderHasArticleController.getAll);
router.get('/order-has-article/:id', orderHasArticleController.getOne);
// router.post('/order-has-article', orderHasArticleController.create);

// STRIPE
router.post('/pay', payController.payment);

// ROUTER
module.exports = router;