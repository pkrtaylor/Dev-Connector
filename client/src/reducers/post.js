import {
    GET_POSTS,
    UPDATE_LIKES,
    POST_ERROR,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    REMOVE_COMMENT,
    ADD_COMMENT
} from '../actions/types'


const initialState ={
    posts:[],
    post: null,
    loading: true,
    error:{}
}


//for update_likes 
// we are going to map through the posts, so for each post we make surre post._id  === payload.id.
// post._id being the id of the post which is currently in the state
//the payload.id is what was sent as the payload when the the call the api is made
//basically the id that comes from the route. making sure its the correct post 
//if it matches, then we return the new state and just maipulate the likes to the likes array that is returned
//if it dosent matches then just return the regular post and do nothing

//for delete_post
// we are bascially we returning all posts except for the one that got deleted
// we just want to immidiately remove it from the UI

//for add_posts
//all we ahe to do is assign to posts the current array with ...state.posts and then 
//we want to add our new post which is in the payload
export default function(state= initialState, action) {
    const {type, payload} = action;

    switch(type){
        case GET_POSTS:
            return{
                ...state,
                posts:payload,
                loading: false
            }
        case GET_POST:
            return{
                ...state,
                post: payload,
                loading: false
            }
        case ADD_POST:
            return{
                ...state,
                posts: [payload, ...state.posts],
                loading: false
            }
        case DELETE_POST:
            return{
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            }

        case UPDATE_LIKES:
            return{
                ...state,
                posts: state.posts.map(post =>
                    post._id === payload.id ? {...post, likes: payload.likes} : post),
                    loading: false
            }
        case POST_ERROR:
            return{
                ...state,
                error: payload,
                lading: false
            }
        case ADD_COMMENT:
            return{
                ...state,
                //we access the current state of post then we manipulate the comments, saving the comments array from the payload as the new comments
                post: {...state.post, comments: payload },
                loading: false
            }
        case REMOVE_COMMENT:
            return{
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter(comment => comment._id !== payload)},
                //we do "!==" because we just deleted it from the server and now we want to remove it from the state and the UI
                loading:false
                
            }
        default:
            return state
    }

}