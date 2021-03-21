require('dotenv').config();
const jwt = require('jsonwebtoken')

// the different secrets that will be used for the signature according to the role of the user
const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET;
const JWT_SIGN_SECRET_ADMIN = process.env.JWT_SIGN_SECRET_ADMIN;

module.exports = {

  // generation of  user token
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

  // generation of  Admin token
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

  // we parse the token that we receive from the user and we parse it to keep only the token
  parseAuthorization: function (authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  
  // we check the identity of the one who fetch our requests
  // if it's a user
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

  // if it's an Admin
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

