import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {Redirect, Route} from "react-router-dom"


// A component will be past into this PrivateRoute component 
// so first we take component passed in and then we use the rest operator 
//to take in any other parameters passed in
//inorder for thsi to work we need to interact with the auth state in our auth reducer  

const PrivateRoute = ({
    component: Component, 
    auth : {isAuthenticated, loading}, 
    ...rest} ) => (
    <Route {...rest} 
    //we have a render prop where we check to see if the user is not authenticated and not loading 
    //if thats true we just redirect to login
    //if user is authenticated then component will load
    render={props => !isAuthenticated && !loading ? (
    <Redirect to='/login'/>) : (<Component {...props} />)}
    
    />
)

PrivateRoute.propTypes ={
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    auth: state.auth
})
export default connect(mapStateToProps)(PrivateRoute)
