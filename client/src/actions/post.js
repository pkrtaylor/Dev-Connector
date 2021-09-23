import axios from 'axios'
import {setAlert} from './alert'
import {
    GET_POSTS,
    UPDATE_LIKES,
    POST_ERROR,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    REMOVE_COMMENT, 
    ADD_COMMENT
} from './types'


//get posts

export const getPosts = () => async dispatch =>{

    try {

        const res = await axios.get('/api/posts')
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }
}
//get post

export const getPost = id => async dispatch =>{

    try {

        const res = await axios.get(`/api/posts/${id}`)
        dispatch({
            type: GET_POST,
            payload: res.data
        })
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }
}



//Add like
//we need to know which post we are adding a like to, so we need to pass in an Id 

export const addLike = id => async dispatch =>{

    try {

        const res = await axios.put(`/api/posts/like/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }
}

//remove like
//we need to know which post we are adding a like to, so we need to pass in an Id 

export const removeLike = id => async dispatch =>{

    try {

        const res = await axios.put(`/api/posts/unlike/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }
}

// delete a post 
// we jsut send the id in the epayload so in the reducer we know how to filter out the post that got deleted from the UI
export const deletePost = id => async dispatch =>{

    try {

        await axios.delete(`/api/posts/${id}`)
        dispatch({
            type: DELETE_POST,
            payload: id
        });

        dispatch(
            setAlert('Post Removed', 'success' )
        )
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }
}


//add post 
export const addPost = formData => async dispatch =>{

    //since we are sending data we have to create config 

    const config ={headers:{
        'Content-Type': 'application/json'
    }}

    try {

        const res = await axios.post('/api/posts', formData, config)
        dispatch({
            type: ADD_POST,
            payload: res.data
        });

        dispatch(
            setAlert('Post Created', 'success' )
        )
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }
}



// ADD COMMENT 
export const addComment=  (postId, formData) => async dispatch =>{

    //since we are sending data we have to create config 

    const config ={headers:{
        'Content-Type': 'application/json'
    }}

    try {

        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)
        dispatch({
            type: ADD_COMMENT,
            //when you add a comment it returns the comments array
            payload: res.data
        });

        dispatch(
            setAlert('Comment Added', 'success' )
        )
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }
}


// ADD COMMENT 
export const deleteComment=  (postId, commentId) => async dispatch =>{

    try {

        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
        dispatch({
            type: REMOVE_COMMENT,
            //payload is commentId so we knoww which one to remove in the state
            payload: commentId
        });

        dispatch(
            setAlert('Comment Deleted', 'success' )
        )
        
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        //msg gives us the error in text form
        //status: gives http status error like 404 or 400 etc
        payload: {msg: err.response.statusText, status: err.response.status}
      })
    }}