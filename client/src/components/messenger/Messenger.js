import React, {useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'
import Conversations from '../conversations/Conversations'
import Message from '../message/Message'
import {connect} from 'react-redux'
import {getConversations} from '../../actions/conversations'
import { getMessages, messageReceived } from '../../actions/messages'
import { addMessage } from '../../actions/messages'
import {io} from "socket.io-client"
import './messenger.css'





const Messenger = ({messageReceived, addMessage, getMessages, getConversations, auth: {user : {_id}}, conversations: {conversation, loading}, messages :{ message}}) => {

    const [currentChat, setCurrentChat]= useState(null);
    const [newMessage, setNewMessage]= useState('');
    const scrollRef = useRef(); // this is for the messages to scroll into view automatically
    const socket = useRef();
    const [arrivalMessage, setArrivalMessage]= useState(null);

   /* 
   we replaced this with a useRef
   useEffect(()=>{
        setSocket(io("ws://localhost:8900"));
    }, []);  
    */

  //create action that updates the state everytime arrival changes

   useEffect(()=>{
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender : data.senderId,
                text : data.text,
                createdAt : Date.now(),
            });
        });
   },[] );// we only want this useeffect to run once

   useEffect( ()=> {

    arrivalMessage  && 
    currentChat?.members.includes(arrivalMessage.sender) &&
    messageReceived(arrivalMessage);
        
    

   }, [arrivalMessage, currentChat]); // when arrivalMessage changes we update our messages
    
   
   useEffect(()=>{
        socket.current.emit("addUser", _id);// inorder to send event to server we use "emit"
        socket.current.on("getUsers", users=>{
            console.log(users)
        });
    }, [_id]);

    useEffect(() =>{
        getConversations(_id);
      }, [getConversations, _id]);

    useEffect(()=> {
        getMessages(currentChat?._id);
    },[currentChat?._id, getMessages]);

    //must use different useffect i think because so it can affect all chats, 
    useEffect(()=>{
            scrollRef.current?.scrollIntoView({behavior: "smooth"}); //the input slows the transition down 
    },[message])// we put message so the useEffect will run when the messages change or each time a message is sent
    
    
    
    
    const handleSubmit = (e) =>{
        e.preventDefault(); //stops page from refreshing dorectly after pressing send
        const message = {
            sender: _id,
            text: newMessage,
            conversationId: currentChat._id
        };
        
        addMessage(message);
        setNewMessage('');
        // if it is not equal to us then it has to be our friend 
        const receiverId = currentChat.members.find( (member) => member !== _id);
        
        socket.current.emit("sendMessage", {
            senderId : _id,
            receiverId, 
            text : newMessage,
        });
    }

    
    return (
        <div className='messenger'>
            <div className='chatMenu'>
                <div className='chatMenuWrapper'>
                    <input placeholder='Search for users' className='chatMenuInput' />
                  {(conversation.map((c) => (
                      <div onClick={()=> setCurrentChat(c)}>
                          <Conversations conversations={c} currentUser={_id}/>
                      </div>
                  )))}            
                </div>
            </div>
            <div className='chatBox'>
                <div className='chatBoxWrapper'>
                   {currentChat ? ( <>
                    <div className='chatBoxTop'>
                       {message.map((m)=> (
                             <div ref={scrollRef}> 
                                 <Message message={m} own={m.sender === _id} />
                             </div>
                       ))}
                        
                        
                    </div>
                    <div className='chatBoxBottom'>
                        <textarea 
                        className='chatMessageInput' 
                        placeholder='write something...'
                        onChange={(e) => setNewMessage(e.target.value) }
                        value={newMessage}
                        ></textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                    </div>
                    </> ) : ( <span className='noConversationText'>Open a conversation to start chat.</span> )}
                </div>
            </div>
            <div className='chatOnline'>
                <div className='chatOnlineWrapper'>Online</div>
            </div>
        </div>
    )
}

Messenger.propTypes = {
    getConversations: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    conversations: PropTypes.object.isRequired,
    getMessages: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    messageReceived: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    conversations: state.conversations,
    messages: state.messages
})
export default connect(mapStateToProps, {getConversations, getMessages, addMessage, messageReceived})(Messenger)
