import React from 'react'
import './Conversations.css'
import pic from '../../img/Robin.jpg'


const Conversations = () => {
    return (
        <div className='conversation'>
            <img 
            className='conversationImg'
            src={pic}
            alt=''
            />
            <span className='conversationName'>Tim Drake</span>
        </div>
    )
}

export default Conversations
