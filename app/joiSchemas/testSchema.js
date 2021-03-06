const Joi = require('joi');

const testSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    content: Joi.string().min(10).required(),
    excerpt: Joi.string().min(10).required(),
    category: Joi.string(), 
    categoryId: Joi.number().integer()
//.xor('category', 'categoryId') veut dire
// qu'il doit y avoir l'un ou l'autre mais au moins l'un des deux
}).xor('category', 'categoryId');

module.exports = testSchema;