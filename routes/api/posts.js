const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Post')
const Profile = require('../../models/Profile');
//lets create a route
//@route    POST api/posts
//@desc     create a post 
//@access   private because you need to be logged in to create a post  

router.post('/', 
[
    auth , 
    [
        check('text', 'Text is required').not().isEmpty()
    ]],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }
        try {
            // remember we are loggged in so we have the token which gives us the user 
        //Id and puts it inside the req.user.id
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post(
            {
                text : req.body.text,
                name : user.name,
                avatar : user.avatar,
                user: req.user.id
            }
    
        )
        const post = await newPost.save();

        res.json(post);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }

    }
);

//@route    GET api/posts
//@desc     Get all posts  
//@access   private because you need to be logged in to create a post  

router.get('/', auth ,
    async (req,res) => {
        try {
            //here we use our post model and add find method to it it then sort
            //we want the most recent to dispalyed first so we sort by date and haev avalue of -1
            const posts = await Post.find().sort({date: -1});
            res.json(posts)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }

    }
);

//@route    GET api/posts/:id
//@desc     Get post by id  
//@access   private because you need to be logged in to create a post  

router.get('/:id', auth ,
    async (req,res) => {
        try {
            //here we use our post model and add find method to it it then sort
            //we want the most recent to dispalyed first so we sort by date and haev avalue of -1
            const post = await Post.findById(req.params.id);
            // we want to check if therre is a post with that id 
            //404 is not found error
            if(!post){
                return res.status(404).json({msg: ' Post not found'})
            }
            res.json(post)
        } catch (err) {
            console.error(err.message);
            //if what they pass in for the Id is not a valid object Id then whatever is in the catch is going to run
            //we want it to say Post not found 
            //the err object has a property called kind adn we want to see if it is equal to an ObjectID
            //if its equal that means its not a formatted object Id which means theres going to be no post found 
            if(err.kind == 'ObjectId'){
                return res.status(404).json({msg: ' Post not found'})
            }
            return res.status(500).send('Server Error');
        }

    }
);

//@route    DELETE api/posts/:id
//@desc     Delete a post  
//@access   private because you need to be logged in to create a post  

router.delete('/:id', auth ,
    async (req,res) => {
        try {
            const post = await Post.findById(req.params.id);

            if(!post){
                return res.status(404).json({msg: ' Post not found'})
            }
            //we want to make sure that the user thats deleting the post, is the user
            //that owns the post 
            //req.user.id is the logged in user and post.user is post user
            //they must match
            //post.user is an ObjectId not a string so we must turn it into a string
            //cuz req.user.id is a string 
            if(post.user.toString() !== req.user.id){
                return res.status(401).json({msg: 'User not authorized'});
            }

            await post.remove();

            res.json({ msg: 'Post removed' });

          
        } catch (err) {
            console.error(err.message);
            if(err.kind == 'ObjectId'){
                return res.status(404).json({msg: ' Post not found'})
            }
            return res.status(500).send('Server Error');
        }

    }
);


//@route    PUT api/posts/like/:id
//@desc     Like a post 
//@access   private  

router.put('/like/:id', auth , async (req, res) =>{
 try {
     const post = await Post.findById(req.params.id);
    // we want to check if the post has already been liked by this user
    // we are using filter which is a high order array method
    //so if the post we jsut got then we move to likes array, then we filter through this array
    //filter takes in a fucntion and the paramter is like 
    //then we compare the current user to the user thats logged in and check if they are equal
    //so basicaly we are going through the entire array, so like.user changes each iteration while req.user.id stays the same
    //Something will be returned only if it matches, so we just check if the length 
    //is greater than 0
    //if it matches its cuz that user is already in their meaning he has already liked the post
     if(post.likes.filter(like => like.user.toString() == req.user.id).length > 0){
        return res.status(400).json({ msg: 'Post alreaady liked'})
     }

     //now if the user hasent already liked it then want to take that post and
     //add on to the likes array
     //we pushthe user thats logged in 

     post.likes.unshift({user : req.user.id})
     // now we save it back in the data base

     await post.save();
     res.json(post.likes);
     
 } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Message')
 }
})


//@route    PUT api/posts/unlike/:id
//@desc     Like a post 
//@access   private  

router.put('/unlike/:id', auth , async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        // we want to check if the post has not been liked
        //if it has not been liked then the length will be equal to 0
        if(post.likes.filter(like => like.user.toString() == req.user.id).length == 0){
           return res.status(400).json({ msg: 'Post has not been liked'})
        }
   
        
       //get remove index which is getting the correct like to remove
       //explanation in map 
       //for each like we return like.user in the map
       //then we get the index of a specifc user
       const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        //now we remove that user from array 
        post.likes.splice(removeIndex , 1 );
        //then save updated post in db
        await post.save();
        res.json(post.likes);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Message')
    }
   })

//@route    POST api/posts/comment/:id
//@desc     Comment on a post 
//@access   private because you need to be logged in to comment   

router.post('/comment/:id', 
[
    auth , 
    [
        check('text', 'Text is required').not().isEmpty()
    ]],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }
        try {
        // remember we are loggged in so we have the token which gives us the user 
        //Id and puts it inside the req.user.id
        const user = await User.findById(req.user.id).select('-password');
        // we want to get a post 
        const post = await Post.findById(req.params.id);
        //new comment to be added
        const newComment = 
            {
                text : req.body.text,
                name : user.name,
                avatar : user.avatar,
                user: req.user.id
            }
        //now we have to add the comment onto the post comments
        post.comments.unshift(newComment);
        await post.save();

        res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }

    }
);

//@route    POST api/posts/comment/:id/:comment_id
//@desc     Delete comment on a post 
//@access   private because you need to be logged in to comment

router.delete('/comment/:id/:comment_id', auth, async (req, res ) =>{

    try {
        
        // get post by id
        const post = await Post.findById(req.params.id);
        // now we want to get comment from post 
        // we have the post, remember to use the lowercase post varible when accessing
        //post from then on
        //this will either give us the comment if it exsts or false
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        // make sure commment exists 
        if(!comment){
            return res.status(404).json({msg : 'Comment does not exist'});
        }

        //make sure euser thats deletingt he comment is the user that made the comment 
        if(comment.user.toString() !== req.user.id){
            return res.status(404).json({msg: 'User not authorized'})
        }
        //find index 
        //the reason why this works is cuz we haev already found the comment. '
        //"comment" is the specifc comment object we want and we get the index 
        const removeIndex = post.comments
        .map(comment => comment.user.toString())
        .indexOf(req.user.id)
        //now we remove that comment from array 
        post.comments.splice(removeIndex , 1 );
        //then save updated post in db
        await post.save();
        res.json(post.comments);
        


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Message');
    }

})
module.exports = router;