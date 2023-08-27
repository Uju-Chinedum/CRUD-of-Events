const { verifyToken } = require("../utils");
const { Unauthenticated } = require("../errors");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Unauthenticated("Unauthorized", "Not authenticated");
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId, email } = verifyToken(token);
    req.user = { userId, email };
    next();
  } catch (error) {
    throw new Unauthenticated("Unauthorized", "Not authenticated");
  }
};

module.exports = authenticateUser;
