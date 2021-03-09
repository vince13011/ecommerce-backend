const Article = require('./Article');
const Category = require('./Category');
const Size = require('./Size');
const Order = require('./Order');
const User = require('./User');
const Address = require('./Address');
const ArticleHasSize = require('./ArticleHasSize');
const Role = require('./Role');

// une question a plusieurs answers
Article.belongsToMany(Category, {
    as: "categories",
    through: 'article_has_category',
    foreignKey: 'article_id',
    otherKey: 'category_id',
    timestamps: false
});

// réciproque : une answer est lié à une seule question
Category.belongsToMany(Article, {
    as: "categoryArticle",
    through: 'article_has_category',
    foreignKey: 'category_id',
    otherKey: 'article_id',
    timestamps: false
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
    as: "user_has_address"
});

User.hasMany(Address, {
    foreignKey: 'user_id',
    as: "address_user"
});

User.belongsTo(Role, {
    foreignKey: 'role_id',
    as: "user_has_role"
});

Role.hasMany(User, {
    foreignKey: 'role_id',
    as: "role_user"
});

module.exports = { Article, Category, Size, User, Role, Order, Address, ArticleHasSize };