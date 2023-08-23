const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
},
{
    toJSON: {
        virtuals: true,
    },
    id: false,
});

// create virtual field for friendCount
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// define User model
const User = model('User', userSchema);

// export User model
module.exports= User;