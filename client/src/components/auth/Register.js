import React, { Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
//any time we use props we should bring in proptypes
import PropTypes from 'prop-types'




// since this is a form we need to have some component state 
//each input needs to hvae its own state and onchange handler 
//onchange handler, so when soemone types it updates the state

//destructure 
const Register = ({setAlert, register}) => {

  const [formData, setFormData] = useState({
    name : '',
    email: '',
    password: '',
    password2: ''

  });

  //we want to be able to pull the name and email stuf out , we dont want to 
  //have to do "formData.name" etc
  // so we destrcuture and pull out name and emai
  
  const {name, email, password, password2} = formData;
  // ... is th espread operator, it copies whats in formData
  //now we cant type in an input unless we have an onChnage handler 
  // we also wat to make it wear we dont have to create a seperate fucntion for value in the form 
  // we are using the name argument in each input element 
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value});

  const onSubmit = async e =>{
    e.preventDefault();
    if(password !== password2){
      //remember setAlert is literally a function we created, it also takes in an alert type 
      //we have danger as the alert type becasue the it is connected to our css for the color of the alerts
      setAlert('Passwords do not match', 'danger');
    }
    else{
      register({name, email, password});
    }
  }
    return ( 
      <Fragment>
         
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
        </p>
      <form className="form" onSubmit= {e => onSubmit(e)} >
        <div className="form-group">
          <input 
          type="text"
          placeholder="Name" 
          name="name" 
          value = {name} 
          onChange = {onChange}
           />
        </div>
        <div className="form-group">
          <input 
          type="email" 
          placeholder="Email Address" 
          name="email"
          value={email}
          onChange = {onChange}
           />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange = {onChange}
            
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
      </Fragment> 
      
    );
    
};

Register.propTypes={
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
};

// when ever we use connect we must export it 
//connect takes in two arguments, any state that you want to map and the second 
// is an object with any action that you want to use in our case setAlert 
// this allows us to access props.setAlert,
export default connect(null, {setAlert, register} )(Register);