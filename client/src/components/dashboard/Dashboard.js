import React, {useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {getCurrentProfile, deleteAccount} from '../../actions/profile'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'
import Spinner from '../layout/Spinner';


//if we want to call getCurrentProfile as soon as dashboard page loads 
//we have to use "useEffect"
//"user && user.name" this means if user exists then show username

const Dashboard = ({getCurrentProfile, auth: {user}, profile: {profile, loading}, deleteAccount}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    //we use ternary hee, if profile and laoding is still null then we show spinner 
    return loading && profile === null ? (<Spinner />) : (<div className='container1'>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
        <i className="fas fa-user"/> Welcome {user && user.name} </p>
        {profile !== null ? (
        <Fragment>
            <DashboardActions/>
            <Experience experience={profile.experience}/>
            <Education education={profile.education} />
            <div className='my-2'>
                <button className='btn btn-danger' onClick={() => deleteAccount()}>
                    <i className='fas fa-user-minus'></i>Delete My Account
                </button>

            </div>
        </Fragment>
        
        ): (

        <Fragment> 
            <p>You have not yet set up a profile, please add some info</p>
            <Link to='/create-profile' className='btn btn-primary my-1'>
                Create Profile
            </Link>
            <div className='my-2'>
                <button className='btn btn-danger' onClick={() => deleteAccount()}>
                    <i className='fas fa-user-minus'></i>Delete My Account
                </button>

            </div>
            </Fragment>
       
        
        )}

        </div>
        );
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}
//allows reducer to be utilized in compoennts 
const mapStateToProps = state =>({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {deleteAccount, getCurrentProfile})(Dashboard)

