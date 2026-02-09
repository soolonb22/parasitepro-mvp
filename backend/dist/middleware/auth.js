"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: 'Server configuration error' });
            return;
        }
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(403).json({ error: 'Invalid token' });
                return;
            }
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
            next();
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};
exports.authenticateToken = authenticateToken;
const generateAccessToken = (userId, email) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({ userId, email }, secret, { expiresIn: '1h' });
};
exports.generateAccessToken = generateAccessToken;
