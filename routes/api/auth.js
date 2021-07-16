const express = require('express');
const router = express.Router();

//lets create a route
//@route    GET api/auth
//@desc     test route
//@access   public: public means you dont need a token to access this route 

router.get('/', (req,res) => res.send('Auth route'));




module.exports = router;