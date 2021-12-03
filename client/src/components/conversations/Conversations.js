import React, {useState, useEffect}from 'react'
import './Conversations.css'
import pic from '../../img/Robin.jpg'
import PropTypes from 'prop-types'
import axios from 'axios'


const Conversations = ({conversations, currentUser}) => {

    const [receiver, setReceiver] = useState(null);
    useEffect(() =>{
        //Logic - with in the members array there are two ids, we want the id that is not of the current user
      
        const receiverId = conversations.members.find((m) => m !== currentUser);
        const getReceiver = async () =>{
            try {
                const res = await axios.get(`/api/users/${receiverId}`);
                setReceiver(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getReceiver();

    }, [currentUser, conversations])
    return (
        <div className='conversation'>
            <img 
            className='conversationImg'
            src={receiver?.avatar}
            alt=''
            />
            <span className='conversationName'>{receiver?.name}</span>
        </div>
    )
}

Conversations.propTypes ={
    conversations: PropTypes.object.isRequired,
    currentUser: PropTypes.string.isRequired,
}

export default Conversations
