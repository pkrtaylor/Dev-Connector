import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

//now we want to map through the array of alerts and the class of styling 
//lets make sure the array is not null and we wanna make sure soemthing is in thearray we dont want to output
//anything is the array is zero

const Alert = ({alerts}) => 
alerts !== null 
&& alerts.length > 0 
//map we just loop through, its like a foreach except we return something  
&& alerts.map(alert => (
    //remember once we enter here were are anazlyzing each alert individually
    //for this div we will need to have a key
    //when ever you map through any array like this with an output of jsx 
    //our key will be alert.id
    //alert is an array, each alert in the array contains a msg and an id and alertType
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
))
    







Alert.propTypes = {
alerts: PropTypes.array.isRequired //short hand is ptar
}



// In this prop we acutally want to get the alert state
// what we saw in the redux devtools, we want to fetch that into this component 
//we cretae a varibale matpStatetopProps, since thats ewxactly what we are doing 
// we are mapping a redux state to a prop in this component, in this case it is the array of alerts
const mapStateToProps = state => ({
    //the alert on the end comes from the rootreducer
    alerts: state.alert
})



export default connect(mapStateToProps)(Alert);
