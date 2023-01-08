const jwt = require("jsonwebtoken");
const User = require("../models/user");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.HEADER, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        let user = await User.findById(decodedToken.id);
        req.user = user;
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.HEADER, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser };
