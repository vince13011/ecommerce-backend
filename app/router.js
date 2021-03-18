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
const statusController = require('./controllers/statusController');
const payController = require('./controllers/payController');



// ARTICLES
router.get('/articles', articleController.getAll);//pas de token
router.get('/article/:id', articleController.getOne);//pas de token
router.post('/article', articleController.create);//token ADMIN
router.put('/article/:id', articleController.update);//token ADMIN
router.delete('/article/:id', articleController.delete);//token ADMIN

// // CATEGORIES
router.get('/categories', categoryController.getAll); //pas de token
router.get('/category/:id', categoryController.getOne);
router.post('/category', categoryController.create);
router.put('/category/:id', categoryController.update);
router.delete('/category/:id', categoryController.delete);

// ORDERS
router.get('/orders', orderController.getAll); //token ADMIN
router.get('/order/:id', orderController.getOne);
router.post('/order', orderController.create);//token USER //ADMIN
// renvoie toutes les orders d'un utilisateur
router.get('/user-orders/:id', orderController.userOrders);
router.put('/order/:id', orderController.update);


// STATUS
router.get('/status', statusController.getAll); //pas de token
router.get('/status/:id', statusController.getOne);
router.post('/status', statusController.create);
router.put('/status/:id', statusController.update);
router.delete('/status/:id', statusController.delete);


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
 router.post('/address', addressController.create);
 router.put('/address/:id', addressController.updateById);
 router.delete('/address/:id', addressController.deleteById);

// // SIZES
router.get('/sizes', sizeController.getAll); // pas de token
router.get('/size/:id', sizeController.getOne);
router.post('/size', sizeController.create);
router.put('/size/:id', sizeController.update);
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

//404
router.use((request, response) => {
    response.status(404).json('404 Not Found');
});
// ROUTER
module.exports = router;