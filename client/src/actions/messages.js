import { GET_MESSAGES, MESSAGE_ERROR, MESSAGE_RECEIVED, UPDATE_MESSAGES } from "./types";
import axios from 'axios'



export const getMessages = conversationId => async dispatch =>{
    try {
        const res = await axios.get(`/api/messages/${conversationId}`);
        dispatch({
            type: GET_MESSAGES,
            payload: res.data
        })
    } catch (err) {
        
        dispatch({
            type: MESSAGE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const addMessage = (message) => async dispatch =>{
    try {
        const res = await axios.post(`/api/messages`, message);
        dispatch({
            type: UPDATE_MESSAGES,
            payload: res.data  //this data is the new message
        })
    } catch (err) {
        
        dispatch({
            type: MESSAGE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const messageReceived = (arrivalMessage) => async dispatch =>{

    dispatch({
        type: MESSAGE_RECEIVED,
        payload: arrivalMessage
    });
}