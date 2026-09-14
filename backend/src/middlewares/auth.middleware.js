const jwt = require("jsonwebtoken");

/**
 * Extracts JWT token from incoming request.
 * Supports:
 * 1. HTTP Cookies: req.cookies.token, req.cookies.jwt
 * 2. Authorization Header: 'Bearer <token>'
 * 3. Custom Headers: 'token', 'x-access-token'
 */
function extractToken(req) {
    if (req.cookies) {
        if (req.cookies.token) return req.cookies.token;
        if (req.cookies.jwt) return req.cookies.jwt;
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    if (req.headers.token) {
        return req.headers.token;
    }

    if (req.headers["x-access-token"]) {
        return req.headers["x-access-token"];
    }

    return null;
}

/**
 * Verifies JWT token and attaches decoded user payload to req.user.
 * Does not restrict by role.
 */
function authenticate(req, res, next) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Authentication required. No token or cookie provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired token.",
        });
    }
}

/**
 * Optional authentication: attaches user if token is valid, but allows guest access.
 */
function optionalAuthenticate(req, res, next) {
    try {
        const token = extractToken(req);
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
    } catch (err) {
        // Proceed as unauthenticated guest
    }
    next();
}

/**
 * Authorization: allows only users with role 'user'.
 * Assumes req.user is already populated by authenticate.
 */
function authorizeUser(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "User is not authenticated.",
        });
    }

    if (req.user.role !== "user") {
        return res.status(403).json({
            error: "Forbidden",
            message: "Access denied. Only standard users can perform this action.",
        });
    }

    next();
}

/**
 * Authorization: allows only artists with role 'artist'.
 * Assumes req.user is already populated by authenticate.
 */
function authorizeArtist(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "User is not authenticated.",
        });
    }

    if (req.user.role !== "artist") {
        return res.status(403).json({
            error: "Forbidden",
            message: "Access denied. Only artists can perform this action.",
        });
    }

    next();
}

/**
 * Generic authorization middleware for multiple allowed roles.
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
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}.`,
            });
        }

        next();
    };
}

/**
 * Combined Authentication & Authorization specifically for 'user' role.
 * Verifies token/cookie AND enforces role === 'user' in a single step.
 */
function authenticateUser(req, res, next) {
    authenticate(req, res, () => {
        authorizeUser(req, res, next);
    });
}

/**
 * Combined Authentication & Authorization specifically for 'artist' role.
 * Verifies token/cookie AND enforces role === 'artist' in a single step.
 */
function authenticateArtist(req, res, next) {
    authenticate(req, res, () => {
        authorizeArtist(req, res, next);
    });
}

module.exports = {
    extractToken,
    authenticate,
    optionalAuthenticate,
    authorizeUser,
    authorizeArtist,
    authorizeRoles,
    authenticateUser,
    authenticateArtist,
};
