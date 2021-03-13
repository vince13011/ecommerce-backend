const jwt = require('jsonwebtoken')

const JWT_SIGN_SECRET= 's0G8S7AGED7ZG534T7909UHGGVCFYRD%HSH%DH%HUG$';

module.exports = {

    generateTokenForUser : (userData)=>{
        return jwt.sign({
            userId: userData.id,
            userEmail:userData.email
            },
            JWT_SIGN_SECRET,
            {
        expiresIn: '1h'
        })
    }

}