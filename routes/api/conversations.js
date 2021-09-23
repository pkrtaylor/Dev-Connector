const express = require('express');
const router = express.Router();


const Conversation = require('../../models/Conversation')




//new conversation 

router.post('/', async (req,res) =>{
    const newConversation = new Conversation({
        members:[req.body.senderId, req.body.receiverId]
    })

    try {
        
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);

    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
        
    }
})

//get convo of user

router.get('/:userId', async (req, res) =>{
    try {
        const conversation = await Conversation.find({
            members : {$in: [req.params.userId]}
        })
        res.status(200).json(conversation);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
})



module.exports = router;