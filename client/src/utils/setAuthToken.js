import axios from 'axios'

//function that takes in a token and if the token is there, it will be added to the header
// we add a global header with axios
// the token passed in comes from local storage 
// so when we have a token we are just going to send it with every request 
const setAuthToken = token =>{
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else{
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken


