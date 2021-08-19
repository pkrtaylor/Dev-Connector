const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config')

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator')

//lets create a route
//@route    GET api/profile/me
//@desc     get current user prfile
//@access   Private becasue we are getting the user profile by the user id thats in the token 
// a token must be sent, meaning we need to bring in the off middleware 

// we are using mongose so we need ot make function async await
//we can refer to the '/me' as an api endpoint 
router.get('/me', auth, async (req,res) => {

    try{
        //here we want to find the profile of a single user /
        //we use the findone method and the key we use is user id we get from the profile schema 
        //so as we can use a method called populate to query data from another schema 
        // this is good beacsue as you see we are originally accessing the Profile schema
        //but with poplulate we can limitied access the user schema

        const profile = await Profile.findOne({user : req.user.id}).populate(
            'user',
            ['name', 'avatar']
        );

        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile);

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route    POST api/profile
//@desc     create or update a user profile 
//@access   Private becasue we are getting the user profile by the user id thats in the token 
// a token must be sent, meaning we need to bring in the off middleware 

router.post('/', 
[
    auth, 
    [
        check('status', 'Status is required')
        .not()  
        .isEmpty(),
        check('skills', 'skills is required ')
        .not()
        .isEmpty()
    ]
],
 async (req, res) =>{
    //we need an errror handler for the validation results 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() });
    }

    // here we are pulling everything out from the body
    const {
        company,
        website, 
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    //now we want to make sure that the paramters are there before we submit to the database
    //build profile object
    //we initialize our profile field to an empty object
    //we build up this profileFeidls obeject to insert into the database
    const profileFields = {};
    // we can get th euser form req.user.id, we get this from the token that has been sent
   //when we add the ".user" it will create the the user object, if here is none already in the profileFields
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location; 
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) 
    {   
        // instead of just setting it equal to skills we neeed to turn it into an array because the informaton submittted
        // will be a comma separated list
        //.split turns a string into an array and it takes in a limiter which will be a comma
        //we want it to not matter, how many spaces there are on th comma for each side
        // so for each skill we trim it 
        profileFields.skills = skills.split(',').map(skill => skill.trim());
             
    }


    //build social object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube; 
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook= facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        // here we loook for a profile by the user
        let profile = await Profile.findOne({user : req.user.id});
        // if that profile is found we update 
        if(profile){
            //update 
            profile = await Profile.findOneAndUpdate(
                {user : req.user.id},
                {$set : profileFields},
                {new : true}
            )

            return res.json(profile);
        }
        //if it is not found then we create new one ad then save it.  
        // create 
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);



        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }


});

//@route    GET api/profile
//@desc    get all profiles 
//@access   Public

router.get('/', async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name' , 'avatar']);
        res.json(profiles);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Message')
    }
})


//@route    GET api/profile/user/:user_id
//@desc    get all profiles 
//@access   Public

router.get('/user/:user_id', async (req,res) => {
    try {
        // we can access info from the url by saying req.params.user_id
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name' , 'avatar']);
        

        if(!profile){
            return res.status(400).json({msg: 'Profile not found'});
        }

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        //we take an err object in and use it with a property called kind
        //ObjectId is a certain kind of error, so if err.kind is equal to a certain kind of error
        //like the id number being too long or short or a valid
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error')
    }
})

//@route    DELETE api/profile
//@desc    get all profiles 
//@access   Private

router.delete('/', auth , async (req,res) => {
    try {
        await Profile.findOneAndRemove({user: req.user.id});

        await User.findOneAndRemove({ _id: req.user.id});
        res.json({msg : 'User Deleted'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Message')
    }
})

//@route    PUT api/profile/experience
//@desc     add profile experience 
//@access   Private
// this is a put instead of a post becasue we are updating part of the profile 
//you can either one tho 
// we will be using express validator since there are parts of the experience 
// we want required 
router.put(
    '/experience', 
    [
        auth,
        [
            check('title' , 'Title is required').not().isEmpty(),
            check('company' , 'Compnay is required').not().isEmpty(),
            check('from' , 'From date is required').not().isEmpty()
        ]]   , 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() })
    }
    // we want to pull the data out of the request body

    const {
        title,
        company,
        location,
        from,
        to,
        current, 
        description

    }= req.body;
    //just writing the words are the same as doing "title : title"
    //this creates an object of the data the user submits
    const newExp ={
        title,
        company,
        location,
        from,
        to,
        current,
        description

    }
   try {
       //first we have to fecth the prfofile of the user
        // rreq.user.id comes from the token dont forget
       const profile = await Profile.findOne({user : req.user.id});
        // profile.experience is an array and we want to add on to it
        //we could use .push() but we will use unshift() becasue it pushes onto
        //the beginning rather than the end.
       profile.experience.unshift(newExp);
       await profile.save();

       res.json(profile);

       
   } catch (err) {
       console.error(err.message)
       res.status(500).json('Server Message')
   }
})

//@route    DELETE api/profile/experience/:exp_id
//@desc     delete experience from profile 
//@access   Private

router.delete('/experience/:exp_id', auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({user : req.user.id});

        // get remove index
        // we map through the experience array in profile and we use the user_id as an index
        //which we get from req.params.exp_id
        const removeIndex = profile.experience.map(item => item.id).indexOf
        (req.params.exp_id);
        //splice() removes a property from an object
        //just include the index and how many objects or properties you wnat removed
        //in our case just one
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Message')
    }
})


//@route    PUT api/profile/education
//@desc     add profile education
//@access   Private
router.put(
    '/education', 
    [
        auth,
        [
            check('school' , 'School is required').not().isEmpty(),
            check('degree' , 'Degree is required').not().isEmpty(),
            check('fieldofstudy' , 'Field of study is required').not().isEmpty(),
            check('from' , 'From date is required').not().isEmpty()
        ]]   , 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() })
    }
    // we want to pull the data out of the request body

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current, 
        description

    }= req.body;
    //just writing the words are the same as doing "title : title"
    //this creates an object of the data the user submits
    const newEdu ={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description

    }
   try {
       //first we have to fecth the prfofile of the user
        // rreq.user.id comes from the token dont forget
       const profile = await Profile.findOne({user : req.user.id});
        // profile.education is an array and we want to add on to it
        //we could use .push() but we will use unshift() becasue it pushes onto
        //the beginning rather than the end.
       profile.education.unshift(newEdu);
       await profile.save();

       res.json(profile);

       
   } catch (err) {
       console.error(err.message)
       res.status(500).json('Server Message')
   }
})

//@route    DELETE api/profile/education/:edu_id
//@desc     delete education from profile 
//@access   Private

router.delete('/education/:edu_id', auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({user : req.user.id});

        // get remove index
        // we map through the experience array in profile and we use the user_id as an index
        //which we get from req.params.edu_id
        const removeIndex = profile.education.map(item => item.id).indexOf
        (req.params.edu_id);
        //splice() removes a property from an object
        //just include the index and how many objects or properties you wnat removed
        //in our case just one
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Message')
    }
})

//@route    GET api/profile/github/:username
//@desc     Get user repos from github
//@access   Public

router.get('/github/:username', (req, res) => {
    try{

        const options = {
            uri : `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=
            ${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent' : 'node.js'}
        };

        request(options, (error, response, body) =>{
            if(error) console.error(err.message);
            // we want to check for a 200 reponse 
            if(response.statusCode!== 200){
                return res.status(404).json({msg : 'No Github profile found'});
            }
            // the body retuned is going to be a regular string with escaped quotes
            //so we surriund it with json.parse
            res.json(JSON.parse(body));
        })

        
    }catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error')
    }
})
module.exports = router;