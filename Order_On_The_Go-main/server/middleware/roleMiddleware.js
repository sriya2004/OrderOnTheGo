const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You are not authorized to access this resource"
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

export default roleMiddleware;
