const express = require('express');
const router = express.Router();

const Message = require('../../models/Message')


//add

router.post('/', async (req,res) =>{
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
})

//get messages of conversation

router.get('/:conversationId', async(req, res) =>{
     try {
         const messages = await Message.find({
             conversationId: req.params.conversationId
         })

         res.status(200).json(messages);
     } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
     }
} )







module.exports = router;











