const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models.js');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

async function register(req, res, next) {
    try {
        const { username, email, password, role = 'user' } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Username, email, and password are required.",
            });
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (trimmedUsername.length < 3) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Username must be at least 3 characters long.",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Please provide a valid email address.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Password must be at least 6 characters long.",
            });
        }

        // 1. Check if email already exists
        const existingEmailUser = await userModel.findUserByEmail(trimmedEmail);
        if (existingEmailUser) {
            return res.status(409).json({
                error: "Conflict",
                message: "A user with this email already exists.",
            });
        }

        // 2. Check if username already exists
        const existingUsernameUser = await userModel.findUserByUsername(trimmedUsername);
        if (existingUsernameUser) {
            return res.status(409).json({
                error: "Conflict",
                message: "This username is already taken.",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user (including role)
        const newUser = await userModel.createUser({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPassword,
            role,
        });

        // Generate token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Set httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.created_at,
            },
            token,
        });
    } catch (err) {
        next(err);
    }
}

async function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return res.status(200).json({
        message: "Logout successful.",
    });
}

async function login(req, res, next) {
    try {
        const { identifier, email, username, password } = req.body;

        const loginIdentifier = (identifier || email || username || "").trim();

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Email or username, and password are required.",
            });
        }

        // Lookup user by either email or username
        const user = await userModel.findUserByEmailOrUsername(loginIdentifier);
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid email/username or password.",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid email/username or password.",
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Set httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.created_at,
            },
            token,
        });
    } catch (err) {
        next(err);
    }
}

async function getMe(req, res, next) {
    try {
        let token = null;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Authorization token is missing or invalid.",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (tokenErr) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid or expired token.",
            });
        }

        const user = await userModel.findUserById(decoded.id);
        if (!user) {
            return res.status(404).json({
                error: "Not Found",
                message: "User not found.",
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.created_at,
            },
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    logout,
    getMe,
};