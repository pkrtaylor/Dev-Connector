const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const config =require('config');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');



//lets create a route
//@route    POST api/users
//@desc     register user
//@access   public: public means you dont need a token to access this route 

// All right, now we want to be able to send data to this route.
//We need to send a name in email and a password in order to register a user.
// we will use express validator 
router.post('/',
//implementation of express validators, empty strings are denied as well 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password', 
        'Please enter a password with 6 or more characters'
    ).isLength({min : 6})

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

        const {name, email, password} = req.body;
        try{

        //See if users exist- if user exist we will send back an error, we dont want multiple emails 
        let user = await User.findOne({email});
        
        if (user){
            return res.status(400).json({errors: [{msg:'User already exists'}]})
        }

        //get user gravitar- we pass the users email into a method, that will
        //that will get us the url of the gravatar
        const avatar = gravatar.url(email, {
            //size
            s:'200',
            r:'pg',
            d:'mm'
        })
        // next we create an instance of a user 
        user = new User({
            name,
            email,
            avatar,
            password
        });

        //encrypt password 
        //first thing we do is create a salt to do the hashing with 
        // the 10 is value passed in called the rounds, 10 is recommended 
        //on the documentation, the more you have the more secure but also the slower it cna be 

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt);
        
        // this also returns a promise so we must put await in front 
        await user.save();


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
                //if no error we send token, hence the code below
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