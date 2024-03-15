const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    return res.status(201).json({
                        message: 'Uporabnik je bil ustvarjen!',
                        result: result
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        message: "Elektronski naslov je zaseden!"
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                message: "Invalid authentication credentials"
            });
        });
};

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Invalid authentication credentials!"
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
            );
            return res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Invalid authentication credentials!"
            });
        });
};

exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({
                users: users
            })
            
        })
        .catch(err => {
            res.status(500).json({
                message: "Fetching users failed!"
            })
        })
}

exports.getUser = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "User not found!" });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Fetching user failed!"
            });
        });
}