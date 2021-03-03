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
},
getOne : async(request,response) =>{

    const id = request.params.id;
    
    try{
    const game = await Article.findOne(id);
    response.json(game);
    }
    catch(err){
        response.status(404).json(err.message);
    }  
}

};

module.exports = articleController;