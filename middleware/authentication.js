const { verifyToken } = require("../utils");
const { Unauthenticated } = require("../errors");

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Unauthenticated("Authentication Invalid");
    }

    const token = authHeader.split(" ")[1];

    try {
        const { userId, email } = verifyToken(token);
        req.user = { userId, email };
        next();
    } catch (error) {
        throw new Unauthenticated("Authentication Invalid");
    }
};

module.exports = authenticateUser;
