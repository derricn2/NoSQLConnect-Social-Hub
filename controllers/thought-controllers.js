const { Thought, User } = require('../models');

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
    const { thoughtText, username, userId } = req.body;
  
    // check if userId exists
    if (!userId) {
      res.status(400).json({ message: 'a valid userId is required to create a thought' });
    }
  
    // check if user with the provided userId exists
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(400).json({ message: 'user not found with the provided userId' });
        }
  
        // create thought
        return Thought.create({ thoughtText, username, userId })
        .then(createdThought => {
          // update user's thoughts array with created thought's ID
          user.thoughts.push(createdThought._id);
          
          res.json({
            message: 'thought created successfully',
            thoughtId: createdThought._id,
            thoughtText: createdThought.thoughtText,
            username: createdThought.username,
          });
        });
    })
    .catch(err => {
      console.error('error creating thought', err);
      res.status(400).json(err);
    });
  },

  // get thought by ID
  getThoughtById(req, res) {
    const thoughtId = req.params.id; // extract thought ID

    if (!thoughtId) {
        return res.status(400).json({ message: 'invalid thought ID' });
    }

    Thought.findById(thoughtId)
        .then((thought) => {
            if (!thought) {
                console.log('thought not found');
                return res.status(404).json({ message: 'thought not found' });
            }

            res.json(thought);
        })
        .catch((err) => {
            console.error('error getting thought', err);
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
    const thoughtId = req.params.id; // extract thought ID

    if (!thoughtId) {
      return res.status(400).json({ message: 'invalid thought ID' });
    }

    let deletedThought;

    Thought.findByIdAndDelete(thoughtId)
      .then((thought) => {
        if (!thought) {
          console.log('thought not found');
          return res.status(404).json({ message: 'thought not found' });
        }

        deletedThought = thought; // store deleted thought

        console.log('deleting thought:', deletedThought);

        // remove the thought's ID from the user's thoughts array
        return User.findByIdAndUpdate(
          thought.userId,
          { $pull: { thoughts: thoughtId } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          console.log('user not found');
          return res.status(404).json({ message: 'user not found' });
        }

        console.log('updated user:', user); // log updated user
      })
      .catch((err) => {
        console.error('error deleting thought', err);
        res.status(500).json({ message: 'an error occurred while updating user' });
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
