import { GET_CONVOS, CONVO_ERROR } from "../actions/types";

const initialState ={

    conversations:[],
    loading: true,
    error:{}
}


export default function(state = initialState, action){

    const {type, payload } = action;

    switch (type) {
        case GET_CONVOS:
            return {
                ...state,
                conversations: payload,
                loading: false
            }
        case CONVO_ERROR:
            return {
                ...state,
                error: payload,
                loading:false
            }
            
        default:
            return state
    }

}