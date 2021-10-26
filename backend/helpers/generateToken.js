const jwt = require("jsonwebtoken");

module.exports = generateToken = (id) => {
  const secret = process.env.SECRET;
  const token = jwt.sign(
    {
      userId: id,
    },
    secret,
    {
      expiresIn: "1w",
    }
  );
  return token;
};
