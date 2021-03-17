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
    },
    
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
      },
      getUserId: function(authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
          try {
            var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
            if(jwtToken != null)
              userId = jwtToken.userId;
          } catch(err) { }
        }
        return userId;
      }
    }

}