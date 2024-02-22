const express = require('express');
const router = express.Router();
const User = require('../controllers/userController');

router.use(express.json());

const isAuthenticated = (req, res, next) => {
    if (req.session.username) {
        // User is authenticated, proceed to the next middleware
        next();
    } else {
        // User is not authenticated, send 401 Unauthorized response
        res.status(401).json({ error: 'Unauthorized' });
    }
};

router.post('/register', User.createUser);
router.post('/login', User.login);
router.post('/protected-route', isAuthenticated, (req, res) => {
    // This route is protected and can only be accessed by authenticated users
    res.json({ message: 'This is a protected route' });
});
router.post('/logout', isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
});

module.exports = router;