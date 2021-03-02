// version un peu trop factorisée, peut-être
/*const validate = (requestPart) => (schema) => (request, response, next) => {
    // on regarde ce qu'il y a dans la partie de la requête à valider et on le valide par rapport au schema Joi
    const { error } = schema.validate(request[requestPart]);

    if (error) {
        response.status(400).json(error.message);
    } else {
        next();
    }
};*/

/**
 * valide le payload d'une requête à partir du schéma passé en argument
 * @param {Joi.schema} schema 
 * @returns {Function} middleware Express prêt à l'emploi
 */
const validateBody = (schema) => (request, response, next) => {
    // on regarde ce qu'il y a dans req.query et on le valide par rapport au schema Joi
    const { error } = schema.validate(request.body);

    if (error) {
        response.status(400).json(error.message);
    } else {
        next();
    }
};

// valide le payload
const validateQuery = (schema) => (request, response, next) => {
    // on regarde ce qu'il y a dans req.query et on le valide par rapport au schema Joi
    const { error } = schema.validate(request.query);

    if (error) {
        response.status(400).json(error.message);
    } else {
        next();
    }
};

module.exports = {
    validateBody,
    validateQuery
};