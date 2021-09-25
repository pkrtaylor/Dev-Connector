import { CONVO_ERROR, GET_CONVOS } from "./types";
import axios from 'axios'





export const getConversations = userId => async dispatch =>{

    try {
        const res = await axios.get(`/api/conversations/${userId}`);
        dispatch({
            type: GET_CONVOS,
            payload: res.data
        })
    } catch (err) {
        
        dispatch({
            type: CONVO_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }


}