const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate JWT token from Cookies or Authorization header.
 * Allows both 'user' and 'artist' roles.
 */
function authenticate(req, res, next) {
    try {
        const token = (req.cookies && req.cookies.token) ||
            (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Authentication token is missing. Please log in.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired authentication token.",
        });
    }
}

/**
 * Middleware to authorize only users with specific roles (e.g. 'artist').
 */
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "User is not authenticated.",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Forbidden",
                message: `Access denied. Only ${allowedRoles.join(", ")} can perform this action.`,
            });
        }

        next();
    };
}

module.exports = {
    authenticate,
    authorizeRoles,
};
