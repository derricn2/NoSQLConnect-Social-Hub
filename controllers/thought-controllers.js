const { Thought } = require('../models');

// controller functions related to thoughts
const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then((thoughts) => {
        res.json(thoughts);
      })
      .catch((err) => {
        console.error('error getting thoughts:', err);
        res.status(400).json(err);
      });
  },

  // create new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        // update user's thoughts array with the created thought's ID
        return User.findByIdAndUpdate(
          req.body.userId,
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error('error creating thought:', err);
        res.status(400).json(err);
      });
  },

  // get thought by ID
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .then((thought) => {
        res.json(thought);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // update a thought by ID
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((thought) => {
        res.json(thought);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // delete thought by ID
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then((thought) => {
        // remove the thought's ID from the user's thoughts array
        return User.findByIdAndUpdate(
          thought.userId,
          { $pull: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // create reaction for a thought
  createReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    )
      .then((thought) => {
        res.json(thought);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // delete reaction from a thought
  deleteReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) => {
        res.json(thought);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
};

module.exports = thoughtController;
