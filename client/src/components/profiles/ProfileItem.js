import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

const ProfileItem = ({
    profile:{
        user:{_id, name, avatar},
        status,
        company,
        location,
        skills
    }
}) => {
    return (
        //the profile class uses css grid so it will align everything nicely
        // if there is a company then we show at company 
        // same with location, we only want the location if there is one
        //we only want a maximum of 4 skills, its an array so we will map through it
        //we use a unique index because skills is just array with words, theres no id, thats why we use index as key
        <div  className="profile bg-light">
        <img src={avatar} alt="" className="round-img" />
        <div>
            <h2>{name}</h2>
            <p>{status} {company && <span> at {company}</span>}</p>
            <p className="my-1">{location && <span>{location}</span>}</p>
            <Link to={`/profile/${_id}`} className="btn btn-primary"> 
            View Profile
            </Link>
        </div>
    
        <ul>
        {skills.slice(0,4).map((skill, index) =>(
            <li key={index} className="text-primary">
                <i className="fas fa-check"></i>{skill}
            </li>
        ))}
        </ul>
           
        </div>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileItem
