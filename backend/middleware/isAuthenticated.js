const jwt = require("jsonwebtoken");
const isAuth = (req, res, next) => {
  const secret = process.env.SECRET;
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).send("Access is Denied");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).send("Access is Denied");
  }
};

module.exports = isAuth;
