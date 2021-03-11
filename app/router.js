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

const orderController = require('./controllers/orderController');
const userController = require('./controllers/userController');
const addressController = require('./controllers/addressController');
const articleHasCategoryController = require('./controllers/articleHasCategoryController');



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
router.get('/orders/:id', orderController.getOne);
router.post('/orders', orderController.create);
// router.put('/orders/:id', orderController.updateById);
// router.delete('/orders/:id', orderController.deleteById);

// // USERS
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getOne);

// // connecter un user ???
router.post('/users', userController.login);
router.put('/users/:id', userController.updateById);
router.delete('/users/:id', userController.deleteById);


// // CREER UN NOUVEL UTILISATEUR
router.post('/signup', userController.create);


// // ADDRESSES
// router.get('/addresses', addressController.getAll);
// router.get('/addresses/:id', addressController.getOne);
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
// router.get('/order/article', orderHasArticleController.getAll);
// router.get('/order/:id/article', orderHasArticleController.getAllInOrder);
// router.post('/order/article', orderHasArticleController.create);

// ROUTER
module.exports = router;