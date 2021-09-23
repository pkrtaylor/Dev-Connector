import axios from 'axios'
import {setAlert} from './alert'

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    ACCOUNT_DELETED
} from './types'

// get current users profile

export const getCurrentProfile = () => async dispatch =>{
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            //we will save this profile data into the state
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            //msg gives us the error in text form
            //status: gives http status error like 404 or 400 etc
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}


//Get all profiles

export const getProfiles = () => async dispatch =>{

    //when they go to the profile list page we want to clear whatver is in th ecurrent profile
    //when we visit a single users profilel it will go into the state

    dispatch({
        type: CLEAR_PROFILE
    });
    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            //we will save this profile data into the state
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            //msg gives us the error in text form
            //status: gives http status error like 404 or 400 etc
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Get profile by id 
//we specifically have 'userId' becasue we are not getting it by the profile id but user id  

export const getProfileById = userId => async dispatch =>{
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
        
            type: GET_PROFILE,
            //we will save this profile data into the state
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            //msg gives us the error in text form
            //status: gives http status error like 404 or 400 etc
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

// get github repos

export const getGithubRepos = username => async dispatch =>{

   
    try {
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            //we will save this profile data into the state
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            //msg gives us the error in text form
            //status: gives http status error like 404 or 400 etc
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}




// create or update a profile 
//history object has a method called push that will redierect us to 
//a client side route 
//in order to know if we are updating or editing or creating a new profile we will have 
//we will have another parameter called edit 


export const createProfile = (formData, history, edit=false) => async dispatch =>{
   try {
    const config = {
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
        type: GET_PROFILE,
        //we will save this profile data into the state
        payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    //if we are editing then we want to stay on the page, if not then we want to redirect 
    // to dashboard
    //also redirecting in an action is different then from compoenent, we have to 
    //pass in this hostroy object that has push methof in it. 
    if(!edit){
        history.push('/dashboard')
    }
   } catch (err) {
    const errors = err.response.data.errors;
    //check to see if there are any errors //we loop through the errors here 
    if(errors){
        errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
        type: PROFILE_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
    })
   }

}


// Add Experience 

export const addExperience = (formData, history) => async dispatch =>{
    try {
     const config = {
         headers: {
             'Content-Type' : 'application/json'
         }
     }
 
     const res = await axios.put('/api/profile/experience', formData, config);
 
     dispatch({
         type: UPDATE_PROFILE,
         //we will save this profile data into the state
         payload: res.data
     });
 
    dispatch(setAlert('Experience Added', 'success'));
 
     
    history.push('/dashboard')
     
    } catch (err) {
     const errors = err.response.data.errors;
     //check to see if there are any errors //we loop through the errors here 
     if(errors){
         errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')));
     }
     dispatch({
         type: PROFILE_ERROR,
         //msg gives us the error in text form
         //status: gives http status error like 404 or 400 etc
         payload: {msg: err.response.statusText, status: err.response.status}
     })
    }
 
 }

 
 export const addEducation = (formData, history) => async dispatch =>{
    try {
     const config = {
         headers: {
             'Content-Type' : 'application/json'
         }
     }
 
     const res = await axios.put('/api/profile/education', formData, config);
 
     dispatch({
         type: UPDATE_PROFILE,
         //we will save this profile data into the state
         payload: res.data
     });
 
    dispatch(setAlert('Education Added', 'success'));
 
     
    history.push('/dashboard')
     
    } catch (err) {
     const errors = err.response.data.errors;
     //check to see if there are any errors //we loop through the errors here 
     if(errors){
         errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')));
     }
     dispatch({
         type: PROFILE_ERROR,
         //msg gives us the error in text form
         //status: gives http status error like 404 or 400 etc
         payload: {msg: err.response.statusText, status: err.response.status}
     })
    }
 
 }

 // Delete experience 
// the route we want to hit is the id of the experience

export const deleteExperience = id => async dispatch =>{
    try {
        
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
    })
    
    dispatch(setAlert('Experience Removed', 'success'));
 
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            //msg gives us the error in text form
            //status: gives http status error like 404 or 400 etc
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const deleteEducation = id => async dispatch =>{
    try {
        
    const res= await axios.delete(`/api/profile/education/${id}`);

    dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
    })
    
    dispatch(setAlert('Education Removed', 'success'));
 
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            //msg gives us the error in text form
            //status: gives http status error like 404 or 400 etc
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}


//DELETE ACCOUNT


export const deleteAccount = () => async dispatch =>{

    if(window.confirm('Are you sure? This cannot be undone!')){
        try {
        
            await axios.delete('/api/profile');
        
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: ACCOUNT_DELETED })
            
            dispatch(setAlert('Your account has been permanantly deleted'));
         
            } catch (err) {
                dispatch({
                    type: PROFILE_ERROR,
                    //msg gives us the error in text form
                    //status: gives http status error like 404 or 400 etc
                    payload: {msg: err.response.statusText, status: err.response.status}
                })
            }
        }
    }


    

