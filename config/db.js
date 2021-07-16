// lets bring in mongoose
const mongoose = require('mongoose');
// now we want to be able to grab that string that we just put into default json
const config = require('config');
const db = config.get('mongoURI');



const connectDB = async () => {
    try{
        await mongoose.connect(db, {useNewUrlParser: true});
        console.log('MongoDB Connected...');
    }
    catch(err){
        console.error(err.message);
        // exit process with failure
        process.exit(1);
    }

};

module.exports = connectDB;