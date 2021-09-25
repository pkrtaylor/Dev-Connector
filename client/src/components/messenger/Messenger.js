import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import Conversations from '../conversations/Conversations'
import {connect} from 'react-redux'
import {getConversations} from '../../actions/conversations'
import './messenger.css'


const Messenger = ({getConversations, auth: {user : {_id}}}) => {

    useEffect(() =>{
        getConversations(_id)
    }, [getConversations, _id])
    
    return (
        <div className='messenger'>
            <div className='chatMenu'>
                <div className='chatMenuWrapper'>
                    <input placeholder='Search for users' className='chatMenuInput' />
                    <Conversations/>
                    <Conversations/>
                    <Conversations/>
                    <Conversations/>                
                </div>
            </div>
            <div className='chatBox'>
                <div className='chatBoxWrapper'>Box</div>
            </div>
            <div className='chatOnline'>
                <div className='chatOnlineWrapper'>Online</div>
            </div>
        </div>
    )
}

Messenger.propTypes = {
    getConversations: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps, {getConversations})(Messenger)
