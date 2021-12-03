import React from 'react'
import pic from '../../img/Robin.jpg'
import './Message.css'
import TimeAgo from 'timeago-react';


const Message = ({message, own}) => {


    return (
        <div className={own ? 'message own' : 'message'}>
            <div className='messageTop'>
                <img 
                className='messageImg'
                src={pic}
                alt=''
                />
            <p className='messageText'>
                {message.text}
            </p>
            </div>
            <div className='messageBottom'><TimeAgo
  datetime={message.createdAt}
  locale='en'
/></div>
        </div>
    )
}

export default Message
