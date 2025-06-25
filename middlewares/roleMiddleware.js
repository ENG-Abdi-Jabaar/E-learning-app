// Middleware to restrict access based on user role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied. Insufficient permissions.' });
    }
    next(); // Proceed if role is allowed
  };
};

module.exports = authorizeRoles;