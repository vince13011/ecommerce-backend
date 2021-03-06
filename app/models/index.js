const Article = require('./article');
const Category = require('./category');
const Size = require('./size');
const Order = require('./order');
const User = require('./user');
const Address = require('./address');
const ArticleHasSize = require('./articleHasSize');
const Role = require('./role');
const OrderHasArticle = require('./orderHasArticle');
const Status = require('./status');

// une question a plusieurs answers
Article.belongsToMany(Category, {
    as: "categories",
    through: 'article_has_category',
    foreignKey: 'article_id',
    otherKey: 'category_id',
    timestamps: false
});

Category.belongsToMany(Article, {
    as: "categoryArticle",
    through: 'article_has_category',
    foreignKey: 'category_id',
    otherKey: 'article_id',
    timestamps: false
});
Article.belongsToMany(Order, {
    through: OrderHasArticle,
    as: "orders",
    foreignKey: 'article_id',
    otherKey: 'order_id',
    otherKey: 'size_id'
});

Order.belongsToMany(Article, {
    through: OrderHasArticle,
    as: "orderArticles",
    foreignKey: 'order_id',
    otherKey: 'article_id',
    otherKey: 'size_id'
});

Article.belongsToMany(Size, {
    through: ArticleHasSize,
    as: 'sizes',
    foreignKey: 'article_id',
    otherKey: 'size_id',
});

Size.belongsToMany(Article, {
    through: ArticleHasSize,
    as: 'size_has_article',
    foreignKey: 'article_id',
    otherKey: 'size_id',
});

Order.belongsTo(Address, {
    foreignKey: 'address_id',
    as: "order_has_address"
});

Address.hasMany(Order, {
    foreignKey: 'address_id',
    as: "address_orders"
});


Address.belongsTo(User, {
    foreignKey: 'user_id',
    as: "address_user"
});

User.hasMany(Address, {
    foreignKey: 'user_id',
    as: "user_has_address"
});

User.belongsTo(Role, {
    foreignKey: 'role_id',
    as: "user_has_role"
});

Role.hasMany(User, {
    foreignKey: 'role_id',
    as: "role_user"
});

Order.belongsTo(Status, {
    foreignKey: 'status_id',
    as: 'order_has_status'
});

Status.hasMany(Order, {
    foreignKey: 'status_id',
    as: 'status_has_orders'
});

module.exports = { Article, Category, Size, User, Role, Order, Address, ArticleHasSize, OrderHasArticle, Status };