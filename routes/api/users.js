const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check')
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
 (req,res) => {
     // to handle the reponse of express validator we have to go into the body here
     // we take the validation results and save it in a variable.
     //if not empty we return it as an json output
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() })
    }
    console.log(req.body); // req.body is the object of data that is going to be sent to this route
    res.send('User route');


});




module.exports = router;