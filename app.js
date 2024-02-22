const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(cookieParser());

app.use(session({
    secret: 'your-secret-key', // Change this to a random secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Mitigates XSS attacks
        maxAge: 24 * 60 * 60 * 1000 // Session expires in 1 day
    }
}));

app.use('/', userRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})