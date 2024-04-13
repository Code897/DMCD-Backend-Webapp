import jwt from 'jsonwebtoken';
import { User } from '../db/models/schema.js';
import { JWT_SECRET } from '../config.js';

export default function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            } else {
                req.user = decoded;
                next();
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function verifyUser(req, res, next) {
    try {
        const { email } = req.method == 'GET' ? req.query : req.body;
        let exist = User.findOne({ email: email });
        if (!exist) {
            return res.status(404).send({ error: " User Not Found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Authentication Error" })
    }
    next()
}

export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: null
    }
    next()
}