import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {};

const middleware = [thunk]; // the only middleware  we have is thunk


// here we acutally create the store 
// since we are using the devltools extension, we can use composeWithDevTools
// and that takes in the applyMiddlware  
//in applyMiddlware we just use the spread operator and add that middleware
//variable we created 
const store = createStore(
    rootReducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleware))
);


export default store;
//we dont have to touch this ever again 
// inorder for us to use the store we have to go to app.js aand bring in two things
//Provider and import this store in the app file.

