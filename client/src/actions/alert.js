// this is an action that we will call

import {SET_ALERT, REMOVE_ALERT} from './types';
import uuid from 'uuid';
//we want to be able to dispatch more than one action type from this fucniton
// we have dispatch, and our thunk middlware allows us to do this 
export const setAlert = (msg, alertType) => dispatch => {
//we want to randomly generate id using package uuid which will give a unversal id on the fly 
//will give an random long string, v4 stands for the version
const id = uuid.v4()
//using dispacth we connect with 
dispatch({
    //call the set alert thats in our reducer
   type:  SET_ALERT,
   //now we send a payload sihnce thats what our reducer needs
   payload: {msg, alertType, id}
});

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 5000);


}

