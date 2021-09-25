import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {addEducation} from '../../actions/profile'


const AddEducation = ({addEducation, history}) => {

    const [formData, setFormData] = useState({

        school: '',
        degree:'',
        fieldofstudy:'',
        from:'',
        to:'',
        current: false,
        description:''
        
    });
    // we want the state of 'to' to be conditonal, if the the current is true meaning
    //user still works there 'to' will be disabled.
    //A different method than toggle was used, it cam from the newest version on github
   

    const { school, degree, fieldofstudy, from, to, current, description } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value});

    return (
        <div className='container1'>
             <h1 className="large text-primary">
       Add Your Education
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school or bootcamp that you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e=>{
          e.preventDefault();
          addEducation(formData, history);
      }}>
        <div className="form-group">
          <input type="text" placeholder="* School or Bootcmap" name="school" value={school} onChange = {onChange} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Degree or Certificate" name="degree" value={degree} onChange = {onChange} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field of Study" name="fieldofstudy" value={fieldofstudy} onChange = {onChange}/>
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange = {onChange}/>
        </div>
         <div className="form-group">
          <p><input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={() => {
                setFormData({ ...formData, current: !current });
              }}
            />{' '}
            Current School</p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange = {onChange} disabled={current}/>
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={description} onChange = {onChange}
            cols="30"
            rows="5"
            placeholder="Program Description"
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
        </div>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
}

export default connect(null, {addEducation})(withRouter(AddEducation))
