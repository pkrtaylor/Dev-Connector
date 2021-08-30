
// profile : when we log in profile is going to make a request and get all of our 
//profile data and put it into "profile"
//profiles:  is for the profile listing page, where we have the list of developers
//repos: fro github repos


import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE } from "../actions/types";

//error object for any errors in the request
const initialState={
    profile: null,
    profiles:[],
    repos:[],
    loading: true,
    error:{}
}

export default function(state= initialState, action){
    const {type, payload} = action;
    
    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:    
           return {
            ...state, //return current state
            profile: payload, //save profile of user into state profile
            loading: false //user is no longer loading since we actually got profile means no error
           }
        case PROFILE_ERROR:
            return{
                ...state,
                error: payload,
                loading: false
            };
        case CLEAR_PROFILE:
            return{
                ...state,
                profile:null,
                repos:[],
                loading:false
            }
            

        default:
            return state;
        
    }
}