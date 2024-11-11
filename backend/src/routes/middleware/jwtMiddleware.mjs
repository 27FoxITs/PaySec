// jwtMiddleware.mjs

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }

    const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;