import {
    REGISTER_FAIL, 
    REGISTER_SUCCESS, 
    USER_LOADED, 
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT} from '../actions/types'

const initialState= {
    //we can access local storage using vaniila JS, we look for an item in local storage called token
    //this will be our token we get back 
    token: localStorage.getItem('token'),
    // when we make a request to register or login, and we get a succes we set this to true
    isAuthenticated: null,
    //we want to make sure that the loading it takes to authenticate a user is done, that weve already made a request to the backend and got a response 
    loading: true, // once we get the data we set it to false, since it will no longer be loading
    user: null // what goes in here is the user data like name email, etc



}

export default function(state = initialState, action){

    const {type, payload} = action;
    
    switch(type){
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload // user is in the payload
            }
         
    
        //we do setItem because we want to put the token that is returned into local storage 
        //up top all we are doing is putting it insde the state token
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:  
            localStorage.setItem('token', payload.token)
            return{
                ...state,
                ...payload,
                isAuthenticated: true, 
                loading: false

            }
        // on register_fail we are going to remove anything thats in local storage for the token
        // if its a failed login we want to remove the token completely
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return{
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false

            }
        default: 
            return state;


    }
}