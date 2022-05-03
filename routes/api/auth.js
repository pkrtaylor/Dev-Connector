const express = require('express');
const router = express.Router();
const config =require('config');
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

//lets create a route
//@route    GET api/auth
//@desc     test route
//@access   public: public means you dont need a token to access this route 
// we are making call to db so fucntion must be async
router.get('/', auth, async (req,res) => {
    try{
        // in our middle ware we set req.user to the user in the token, which is why we can access it here
        // we dont want the password so we add the end portion
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//lets create a route
//@route    POST api/auth
//@desc    Authenticate user and get token 
//@access   public: public means you dont need a token to access this route 

// All right, now we want to be able to send data to this route.
//We need to send a name in email and a password in order to login a user.
// we will use express validator 
router.post('/',
//implementation of express validators, empty strings are denied as well 
[
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password', 
        'Password is required'
    ).exists()

],
 async (req,res) => {
     // to handle the reponse of express validator we have to go into the body here
     // we take the validation results and save it in a variable.
     //if not empty we return it as an json output
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //400 is a bad request, 200 is a good request
        return res.status(400).json({errors: errors.array() })
    }
      //json() returns a JSON object of the result (if the result 
        //was written in JSON format, if not it raises an error). 
        //----------------------------------------------------
        // we can destructure req.bdoy and store so we dont have to keep calling it

        const { email, password} = req.body;
        try{

        //See if users exist- 
        let user = await User.findOne({email});
        // now we want to check if there is no user and if not we will send back an error

        if (!user){
            return res.status(400).json({errors: [{msg:'Invalid Credentials'}]})
        }
        // we need to match the email and password 
        // bcrypt has a method called compare that takes in a plain text 
        //password and an encrpyted password and tells them if it is match or not
        //the compare method returns a promise 

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({errors: [{msg:'Invalid Credentials'}]})
        }
        // if we look closely at the error messages we placed, the reason for them being the same is that if we had the password as "password does not match" then someone could see if user existed or not. could pose a security risk
       
       
       
        // return jsonwebtoken
        //creation of payload and user.id is the mongodb id. becasue user.save()
        //returns a promise we can get the ID. 
        const payload ={
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtsecret'),
            {expiresIn: 360000} , // expiration 
            // inside this callback we get either an error or token. if we
            //dont get an error then we send token back to the client 
            (err, token) => {
                if(err) throw err;
                res.json({token})
            }  );
        }
        catch(err){
        // if something goes wrong it will be a server error.
        console.error(err.message);
        res.status(500).send('Server Error');


        }



});


module.exports = router;