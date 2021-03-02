const { response } = require('express');
const Article= require('../models/article');

const articleController = {

getAll :async (request,response)=>{
    try{
       const result = await Article.findAll()
        response.json(result)
    }
    catch(err){
        response.status(404).json(`L'article  n'existe pas`); 
    }
    
}
};

module.exports = articleController;