const sanitizeHtml = require('sanitize-html');

// Le but de ce middleware est d'assainir les données envoyer par les utilisateurs
const bodySanitizer = (request, response, next) => {
    // 1ère chose on vérifie que l'on a un body, rienne sert d'éxécuter ce middleware si jamais on récupère de l'information

    const sanitizeArray = (array) => {
        return array.map(el => sanitizeProp(el));
    }
    
    const sanitizeObject = (object) => {
        for (const propName in object) {
            object[propName] = sanitizeProp(object[propName]);
        }
        return object;
    }
    
    const sanitizeProp = (propValue) => {
        if (Array.isArray(propValue)) {
            return sanitizeArray(propValue);
        } else if (typeof propValue === "object") {
            return sanitizeObject(propValue);
        }
        return sanitizeHtml(propValue);
    }
    

    if (request.body) {
        for (const propName in request.body) {
            // Grâce à la propriété de l'objet request.body on peut lui assigner une nouvelle valeur en lui refournissant sa propre valeur, mais en prenant soin de transformer celle-ci grâce à la function sanitizeHtml du module sanitize-html
            request.body[propName] = sanitizeProp(request.body[propName]);
        }
    }
    next();
}

module.exports = bodySanitizer;