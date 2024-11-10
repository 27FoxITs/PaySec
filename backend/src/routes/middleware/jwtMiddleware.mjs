// third-party imports -------------------------------------------------------------------------- //
import jwt from 'jsonwebtoken';  // ES Module syntax to import jsonwebtoken
import dotenv from 'dotenv';     // ES Module syntax for dotenv (for environment variables)

dotenv.config();  // Initialize dotenv to use environment variables

// Function to verify JWT
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Assuming the token is sent in the Authorization header

    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }

    // Remove "Bearer " prefix from the token if it exists
    const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded; // Attach the decoded user data to the request object
        next(); // Pass control to the next middleware
    });
};

export default jwtMiddleware