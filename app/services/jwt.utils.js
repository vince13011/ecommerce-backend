require('dotenv').config();
const jwt = require('jsonwebtoken')

// les différents secret qui vont servir à la signature selon le role du user
const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET;
const JWT_SIGN_SECRET_ADMIN = process.env.JWT_SIGN_SECRET_ADMIN;

module.exports = {

  //génération du token user
  generateTokenForUser: (userData) => {
    return jwt.sign({
      userId: userData.id,
      userEmail: userData.email
    },
      JWT_SIGN_SECRET,
      {
        expiresIn: '1h'
      })
  },

  //génération du token admin
  generateTokenForAdmin: (userData) => {
    return jwt.sign({
      userId: userData.id,
      userEmail: userData.email
    },
      JWT_SIGN_SECRET_ADMIN,
      {
        expiresIn: '1h'
      })
  },

    // on parse le token que l'on reçoit du user et on le parse pour ne garder que le token
  parseAuthorization: function (authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  
  //on vérifie l'identité de celui qui fetch nos requêtes
  //si c'est un user
  getUserId: function (authorization) {
    var userId = -1;
    var token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null)
          userId = jwtToken.userId;
      } catch (err) { }
    }
    return userId;
  },

  //si c'est un admin
  getAdminId: function (authorization) {
    var userId = -1;
    var token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET_ADMIN);
        if (jwtToken != null)
          userId = jwtToken.userId;
      } catch (err) { }
    }
    return userId;
  }
}

