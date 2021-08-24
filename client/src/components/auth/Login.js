import React, { Fragment, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// note - login the acction is a prop so we place it in paramter 
import {login} from '../../actions/auth'// importing the login action 


// since this is a form we need to have some component state 
//each input needs to hvae its own state and onchange handler 
//onchange handler, so when soemone types it updates the state
const Login = ({login, isAuthenticated}) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''

  });

  //we want to be able to pull the name and email stuf out , we dont want to 
  //have to do "formData.name" etc
  // so we destrcuture and pull out name and emai
  
  const {email, password} = formData;
  // ... is th espread operator, it copies whats in formData
  //now we cant type in an input unless we have an onChnage handler 
  // we also wat to make it wear we dont have to create a seperate fucntion for value in the form 
  // we are using the name argument in each input element 
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value});

  const onSubmit = async e =>{
    e.preventDefault();
    //this shall fire off the login action 
    login(email, password);
    
  }

  if(isAuthenticated){
    // with react router we can do 'redirect'
    return <Redirect to='/dashboard' />;
  }
    return ( 
      <Fragment>
         
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into Your Account
        </p>
      <form className="form" onSubmit= {e => onSubmit(e)} >
        <div className="form-group">
          <input 
          type="email" 
          placeholder="Email Address" 
          name="email"
          value={email}
          onChange = {onChange}
           />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange = {onChange}
            minLength="6"
            
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign In</Link>
      </p>
      </Fragment> 
      
    );
    
};


Login.propTypes ={
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool // shorthand : ptb
}
// this allows us to manipulate values in state or just the state in components
//so we are basically turning our state into a props, since props can be used in components
//isAuthenticated is now a prop we can use 
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login)