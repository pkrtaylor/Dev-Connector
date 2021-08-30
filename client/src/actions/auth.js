import axios from 'axios'
import {
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOADED, 
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    CLEAR_PROFILE,
    LOGOUT} from './types';
import {setAlert} from  './alert'
import setAuthToken from '../utils/setAuthToken'




//LOAD USER

export const loadUser = () => async dispatch =>{
   // so if there is a token, this will set the header with it  
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
        
    }
}







// register user
export const register = ({name, email, password}) => async dispatch =>{
    const config = {
        headers:{
            'Content-Type' : 'application/json'
        }
    }
    const body = JSON.stringify({name, email, password});

    try {
        
        const res = await axios.post('/api/users', body, config);
        
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data // this is the token cuz we get a token back on a successful reponse 
        });
        dispatch(loadUser());
        } catch (err) {
        //we want to display the errors from validation as alerts
        // the errors at the end is an array 
        const errors = err.response.data.errors;
        //check to see if there are any errors //we loop through the errors here 
        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }

};

//Login user

export const login = ({ email, password}) => async dispatch =>{
    const config = {
        headers:{
            'Content-Type' : 'application/json'
        }
    }
    const body = JSON.stringify({ email, password});
    
    try {
        // we are logging in/ authenticating so we send request to api/auth
        const res = await axios.post('/api/auth', body, config);
        
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data // this is the token cuz we get a token back on a successful reponse 
        });

        dispatch(loadUser());
    } catch (err) {
        //we want to display the errors from validation as alerts
        // the errors at the end is an array 
        const errors = err.response.data.errors;
        //check to see if there are any errors //we loop through the errors here 
        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAIL
        });
    }

};

//logout action

export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE});
    dispatch({ type: LOGOUT });
    
}