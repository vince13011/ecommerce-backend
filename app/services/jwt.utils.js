require('dotenv').config();
const jwt = require('jsonwebtoken')

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET;
const JWT_SIGN_SECRET_ADMIN = process.env.JWT_SIGN_SECRET_ADMIN;

module.exports = {

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

  parseAuthorization: function (authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  
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

