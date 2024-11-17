const User = require("../models/User");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const username = req.body.username; 
      const user = await User.findOne({ username });

      if (!user) return res.status(404).send("User not found.");

      if (!roles.includes(user.role)) {
        return res.status(403).send("Access denied. You do not have the required permissions.");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error.");
    }
  };
};

module.exports = { checkRole };
