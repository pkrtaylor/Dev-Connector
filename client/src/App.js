import React,{ Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import setAuthToken from './utils/setAuthToken'
import './App.css';

// to call loadUser we will use a package called useEffect
import {loadUser} from './actions/auth'
//Redux 
//Provider connects redux and react, redux is actually seperate from react
//by surroudding the entire app in provider it brings both frameworks together
// wrapping our app in provider allows all our compoents to access the app level state
import {Provider} from 'react-redux'
//you must pass in the store in provider element 
import store from './store'
// we are just returning a single elemnt so we can get rid of the curly braces and return
// the fragment directly 
// we want a section with class name contianer because ervy page with in the
//theme except for the landing page has a class container to push evrythign to the middle
//on the ladning oage we want the imaeg to go all the way over so it dosent have the class container 
if(localStorage.token){
  setAuthToken(localStorage.token);
}


const App = ()  => { 
  //useEffect takes in a fucntion 
  //when the state updates the useEffect fucntoin will keep running sort of like a loop
  //we only want it to run once so we add an empty bracket in as annother argument 
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
  <Provider store={store}>
  <Router>
    <Fragment>
  <NavBar/>
  <Route exact path='/' component={Landing} />
  
  <section className="container">
    <Alert/>
    <Switch>
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
    </Switch>

  </section>
</Fragment>
  </Router>
  </Provider>
)};

 
export default App;
