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
        
        // check if user with the provided username exists
        User.findOne({ username: username })
        .then(existingUser => {
          if(!existingUser) {
            return res.status(400).json({ message: 'user not found with the provided username' });
          }

        // create thought
        Thought.create({ thoughtText, username, userId })
        .then(createdThought => {
          // update user's thoughts array with created thought's ID
          user.thoughts.push(createdThought._id);
          user.save();
          
          res.json({
            message: 'thought created successfully',
            thoughtId: createdThought._id,
            thoughtText: createdThought.thoughtText,
            username: createdThought.username,
          });
        })
      .catch(err => {
        console.error('error creating thought', err);
        res.status(400).json(err);
      });
    })
    .catch(err => {
      console.error('Error finding user by username', err);
      res.status(400).json(err);
    });
})
  .catch(err => {
    console.error('Error finding user by userId', err);
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
    const { thoughtText, username } = req.body;
    const thoughtId = req.params.id; // extract thought ID

    if (!thoughtId) {
      return res.status(400).json({ message: 'invalid thought ID' });
    }

    // check if thought with the provided ID exists
    Thought.findById(thoughtId)
    .then(thought => {
      if (!thought) {
        return res.status(404).json({ message: 'thought not found' });
      }

      // check if user with the provided username exists
      User.findOne({ username: username })
      .then(existingUser => {
        if (!existingUser) {
          return res.status(400).json({ message: 'user not found with the provided username' });
        }

        // update thought
        Thought.findByIdAndUpdate(thoughtId, { thoughtText, username }, { new: true })
        .then(updatedThought => {
          res.json(updatedThought);
        })
        .catch(err => {
          console.error('error updating thought', err);
          res.status(400).json(err);
        });
      })
      .catch(err => {
        console.error('error finding user by username', err);
        res.status(400).json(err);
      });
    })
  },

  // delete thought by ID
  deleteThought(req, res) {
    const thoughtId = req.params.id; // extract thought ID
  
    if (!thoughtId) {
      return res.status(400).json({ message: 'invalid thought ID' });
    }
  
    Thought.findByIdAndDelete(thoughtId)
      .then((thought) => {
        if (!thought) {
          console.log('thought not found');
          return res.status(404).json({ message: 'thought not found' });
        }
  
        let deletedThought = thought; // store deleted thought
  
        console.log('deleting thought:', deletedThought);
  
        if (thought.userId) {
          User.findByIdAndUpdate(
            thought.userId,
            { $pull: { thoughts: thoughtId } },
            { new: true }
          )
            .then((user) => {
              if (!user) {
                console.log('user not found'); // user ID was not available
                return res.status(404).json({ message: 'user not found' });
              }
  
              console.log('updated user:', user); // log updated user
  
              // update the deletedThought variable
              deletedThought = thought._id;
  
              // send response
              return res.json({
                message: 'thought deleted successfully',
                deletedThought,
              });
            })
            .catch((err) => {
              console.error('error updating user', err);
              res.status(500).json({ message: 'an error occurred while updating user' });
            });
        } else {
          // if no user ID associated with thought, send response
          return res.json({
            message: 'thought deleted successfully',
            deletedThought: deletedThought._id,
          });
        }
      })
      .catch((err) => {
        console.error('error deleting thought', err);
        res.status(500).json({ message: 'an error occurred while deleting thought' });
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
