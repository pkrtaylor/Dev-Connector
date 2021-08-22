import {REMOVE_ALERT, SET_ALERT} from '../actions/types'
//alerts are going to be objects in this array and they will have an id 
//, a message and alert type 
const initialState = []
//action contians two things a type and a payload which will be the data
// we need to evaluate the type 

export default function(state = initialState, action){
    //destructure 
    const {type, payload} = action;
    //action is an objecct and has type in it. we evaluate this type with cases
    //common convention is to use variables for types
    switch(type){
        //depending on the tpye we need to determine what we want to send 
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            //remove a specifc alert by its id
            //we return the array of the intial state and filter through it
            //and check is the alert id is not equal to the payload, the payload in this  case is gonna be just the id
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}