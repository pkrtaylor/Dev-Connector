import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
//react moment is used to format our dates 
import {connect} from 'react-redux'

const Experience = ({experience}) => {

    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className='hide-sm'>{exp.title}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
                {exp.to === null ? ('Now') : ( <Moment format='YYYY/MM/DD'>{exp.to}</Moment>)}
            </td>
            <td>
                <button className='btn btn-danger'>Delete</button>
            </td>
        </tr>
      

    ));
    return (
        <Fragment>
            <h2 className='my-2'>Experience Credentials</h2>
            <table className='table'>
                <thread>
                    <tr>
                        <th>Company</th>
                        <th className='hide-sm'>Title</th>
                        <th className='hide-sm'>Years</th>
                        <th />
                    </tr>
                </thread>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    )
}

Experience.propTypes = {
    experience: PropTypes.array.isRequired
}

export default Experience
