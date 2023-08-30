const { User } = require('../models');

// controller functions related to users
const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    // create new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    // get user by ID
    getUserById(req, res) {
        User.findById(req.params.id)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    // update user by ID
    updateUser(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    // delete a user by ID
    deleteUser(req, res) {
        User.findByIdAndDelete(req.params.id)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    // add friend to user's friend list
    addFriend(req, res) {
        User.findByIdAndUpdate(
            req.params.userId,
            { $push: { friends: req.params.friendId } },
            { new: true }
        )
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    // remove friend from a user's friend list
    removeFriend(req, res) {
        User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },
};

module.exports = userController;