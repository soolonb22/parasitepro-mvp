"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        const result = await (0, database_1.query)('INSERT INTO users (email, password_hash, first_name, last_name, image_credits) VALUES ($1, $2, $3, $4, 0) RETURNING id, email, first_name, last_name, image_credits', [email, passwordHash, firstName || null, lastName || null]);
        const user = result.rows[0];
        const accessToken = (0, auth_1.generateAccessToken)(user.id, user.email);
        console.log(' User registered:', user.email);
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                imageCredits: user.image_credits
            },
            accessToken
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, database_1.query)('SELECT id, email, password_hash, first_name, last_name, image_credits FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const user = result.rows[0];
        const passwordValid = await bcrypt_1.default.compare(password, user.password_hash);
        if (!passwordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        await (0, database_1.query)('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
        const accessToken = (0, auth_1.generateAccessToken)(user.id, user.email);
        console.log(' User logged in:', user.email);
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                imageCredits: user.image_credits
            },
            accessToken
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.default = router;
