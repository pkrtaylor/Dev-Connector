const jwt = require('jsonwebtoken');
const config = require('config'); //  we bring in config cuz we need the jwt secret

// becuase its a middleware fuction it takes in three things, request response and next
// a middleare fucntion is basically a  fuction that has access to the req and res cycle and objects
// next is a callback that we haev to run so we can move onto the next piece of middleware

module.exports = function(req, res, next){
    //get token from header
    //when we send a request to protected route we need to send the token
    //within a header
    //we can get the toekn with request cuz we have access to that request object
    //which has a header property 
    const token = req.header('x-auth-token');

    //check if no token
    if(!token){
        // 401 status means unauthorized 
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    // verify token
    try{
        // decode the token, this can be ddone with jwt verify
        // it takes in the acutal token and the secret.
        const decoded = jwt.verify(token, config.get('jwtsecret'))
        // now we take a request object and assign a value to user, that value beieng the user object from the payload.
        req.user = decoded.user;// from this we can use the body of req.user in any of our protected routes
        next();
    }
    catch(err){
        //the catch will run if the token is not valid.
        res.status(401).json({msg: 'Token is not valid'});

    }

};


