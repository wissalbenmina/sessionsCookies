const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt')
const users = require('../models/users');

const createUser = (req, res) => {
    const {username, password} = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const newUser = {
            username: username,
            password: hashedPassword
        };

        users.push(newUser);

        const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        
        res.status(201).json({ username });
    });
}   

const login = (req, res) => {
    const {username, password} = req.body;

    const user = users.find(u => username == u.username);

    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if(err){
            return res.status(500).json({error: 'Internal Server Error'})
        } else if(result){
            req.session.username = username;
            return res.status(200).json({message: 'Login Successful', username })
        } else{
            return res.status(401).json({error: 'Authentification failed'})
        }
    })
}

module.exports = {
    createUser,
    login
}