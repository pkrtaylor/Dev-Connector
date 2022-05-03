const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    user: {
        // we want post to be connected to a user 
        type :  Schema.Types.ObjectId,
        //we are referencing the user model
        ref : 'users'
    },

    text: {
        type: String,
        required : true
    },

    name : {
        type : String
    },
    avatar : {
        type : String
    },
    // here we create an array of likes and with in the array we have the user
    likes : [
       {
        user : {
            type: Schema.Types.ObjectId,
            //we reference the user that we know which like came from which user
            ref : 'users'
        }
       }
    ],

    comments : [
        {
            user : {
                type : Schema.Types.ObjectId,
                ref: 'users'
            },
            text : {
                type : String,
                required : true
            },
            name : {
                type : String
            },
            avatar : {
                type: String
            },
            date: {
                type: Date,
                default : Date.now
            }
    
        }

    ],

    date : {
        type : Date,
        default : Date.now
    }
})
// 'post' is the name that goes into the data base
module.exports = Post = mongoose.model('post', PostSchema)