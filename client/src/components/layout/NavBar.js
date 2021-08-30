import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth'


// we pull out isAuthenitcated and loading
// we want to maksure the user is done loading before we putt he linksin  
//"hide-sm" is a css class that will only show the icon when the screen is on mobile view
const NavBar = ( { auth: {isAuthenticated, loading}, logout } ) => {
    const authLinks = (
        <ul>
           <li><Link to="/dashboard">
           <i className="fas fa-user"></i>{' '}
           <span className="hide-sm">Dashboard</span>
           </Link></li>
        <li><a onClick={logout} href="#!">
            <i className="fas fa-sign-out-alt"></i>{' '}
            <span className="hide-sm">Logout</span></a></li>

      </ul>
    )

    const guestLinks =(
        <ul>
        <li><a href="#!">Developers</a></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    )
        // first thing we want to check is if we are done loading 
        //cuz in the authreducer the initial state is true by default
        // we will use a && clasue
        //if not loading then do this 
        //we use ternary instead of && becasue we have an else 
        return (
        <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i class="fas fa-code"></i> DevConnector</Link>
      </h1>
    {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks }</Fragment>)}
    </nav>
    )
}

NavBar.propTypes = {
    logout: PropTypes.func.isRequired,
    //auth state is an on object
    auth: PropTypes.object.isRequired,//shorthand is ptor
}
const mapStateToProps = state => ({
    // we are going to map the entire auth state
    auth: state.auth
})

export default connect(mapStateToProps, {logout})(NavBar);