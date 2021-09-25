import React, { Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getProfiles} from '../../actions/profile'
import ProfileItem from './ProfileItem'


const Profiles = ({getProfiles, profile:{loading, profiles}}) => {
    //as soon as this runs we want to run getProfiles,so we use a useEffect
    // we only want it to run once so we use empty bracket as second parameter
    useEffect(()=>{
        getProfiles();
    }, [getProfiles])
    //after this runs the profile will be in the state
    

   // we take the profiles and map through them and for each profile we return
   //a ProfileItem, it takes in a key and profile data for that specific person
    return <div className='container1'>
        {loading ? <Spinner/> : 
        <Fragment>
        <h1 className="large text-primary">Developers</h1>
        <p className="lead">
        <i className='fab fa-connectdevelop'></i>Browse and connect with developers
        </p>
        <div className="profiles">
            {profiles.length > 0 ? (
                profiles.map(profile => (
                    <ProfileItem key={profile._id} profile={profile}/>
                ))) : 
                <h4>No profiles found...</h4>}
        </div>
        </Fragment>
            }
    </div>
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state =>({
    profile: state.profile
})

export default connect(mapStateToProps, {getProfiles})(Profiles)
//we map state to props becuase we need the state of our profile in this component 