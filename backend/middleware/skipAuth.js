const skipAuth = (req, res, next) => {
  const urls = [/^\/api\/register\/.*/];
  if (req.url === urls) {
    return next();
  }
};

module.exports = skipAuth;
