const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    //we want to create a reference to the user model because every profile shoudl be associated with a user 
    user : {
        //connection is made to the Id in the user model, the database created id 
        type : mongoose.Schema.Types.ObjectId,
        // next we add the reference to the user model we are talking about
        ref : 'user'
    },
    company : {
        type : String
    },
    website : {
        type : String
    },
    location : {
        type : String
    },
    status : {
        //represents the level of developer you are at
        type : String,
        required : true
    },
    skills : {
        type : [String],
        required : true
    },
    bio : {
        type : String
    },
    githubusername : {
        type : String
    },
    //experience is an array of other fields.
    experience : [
        {
            title : {
                type: String,
                required : true
            },
            company : {
                type : String,
                required : true
            },
            location : {
                type : String
            },
            from : {
                type : Date,
                required: true
            },
            to : {
                type: Date,
                required: true
            },
            //this is for if they cirrently work there, there will be a check box
            current : {
                type : Boolean
            },
            description : {
                type: String
            } 

        }
    ],
    education : [
        {
            school : {
                type: String,
                required : true
            },
            degree : {
                type : String,
                required : true
            },
            fieldofstudy : {
                type : String,
                required: true
            },
            from : {
                type : Date,
                required: true
            },
            to : {
                type: Date,
                
            },
            //this is for if they cirrently work there, there will be a check box
            currrent : {
                type : Boolean
            },
            description : {
                type: String
            } 

        }
    ],

    social : {
        youtube : {
            type : String
        },
        twitter : {
            type : String
        },
        facebook : {
            type : String
        },
        linkedin : {
            type : String
        },
        instagram : {
            type: String
        }
    },
    date : {
        type : Date,
        default : Date.now
    }




});

module.exports = Profile = mongoose.model('profile', ProfileSchema)