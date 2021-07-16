const mongoose = require('mongoose');
// we are setting up a user model
// this schema takes in an object with all the fields that we want 
const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email:{
    type: String,
    required: true,
    unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type : Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema)
//model takes in two things: the model name - "user" and the schema - "USerSchema"