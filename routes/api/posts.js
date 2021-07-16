const express = require('express');
const router = express.Router();

//lets create a route
//@route    GET api/post
//@desc     test route
//@access   public: public means you dont need a token to access this route 

router.get('/', (req,res) => res.send('Post route'));




module.exports = router;