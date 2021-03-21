const sanitizeHtml = require('sanitize-html');

    // The goal of this middleware is to clean up the data sent by users
    const bodySanitizer = (request, response, next) => {

    // in the case of an array
    const sanitizeArray = (array) => {
        return array.map(el => sanitizeProp(el));
    }
    

    // in the case of an object
    const sanitizeObject = (object) => {
        for (const propName in object) {
            object[propName] = sanitizeProp(object[propName]);
        }
        return object;
    }
    
    // depending on the data format we go through one of the two functions above
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
            // Thanks to the property of the request.body object, we can assign a new value to it by giving it its own value
            // but taking care to transform it using the sanitizeHtml function of the sanitize-html module
            request.body[propName] = sanitizeProp(request.body[propName]);
        }
    }
    next();
}

module.exports = bodySanitizer;