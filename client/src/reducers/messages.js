import { MESSAGE_ERROR, GET_MESSAGES, UPDATE_MESSAGES, MESSAGE_RECEIVED } from "../actions/types";


const initialState ={
    message: [],
    loading: true,
    error:{}
}

export default function(state = initialState, action){

    const {type, payload } = action;

    switch (type) {
        case GET_MESSAGES:
            return {
                ...state,
                message: payload,
                loading: false
            }
        case UPDATE_MESSAGES:
        case MESSAGE_RECEIVED:
            return{
                ...state,
                message: [...state.message, payload],
                loading: false
            }
        case MESSAGE_ERROR:
            return {
                ...state,
                error: payload,
                loading:false
            }
            
        default:
            return state
    }

}