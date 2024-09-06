// Checks authentication for API's
export const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// Checks authentication for UI
export const checkAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  return res.redirect('/login')
};