const express = require('express');
const connectDB = require('./config/db');
const { Server } = require("socket.io");

const app = express();

//connect database
connectDB();

app.get('/', (req, res) => res.send('API Running'));


// initializ middleware- this allows us to get the data in req.body- we dont have to use th epaser module 
app.use(express.json({extended: false}));

//define routes

app.use('/api/users', require('./routes/api/users') )
app.use('/api/auth', require('./routes/api/auth') )
app.use('/api/profile', require('./routes/api/profile') )
app.use('/api/posts', require('./routes/api/posts') )
app.use('/api/conversations', require('./routes/api/conversations') )
app.use('/api/messages', require('./routes/api/messages') )


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));






//https://socket.io/docs/v4/emit-cheatsheet
const io = new Server(8900, {cors: {
    origin : "http://localhost:3000",
}, });


//the socketId for users are always changing upon page relod 
// we must create user object and stor userIds
//to send to server we 
// let keyword allows mutibility 
let users = [];

const addUser = (_id, socketId) => {
    //if the user is inside users already we will not add
    !users.some((user) =>user._id === _id) &&
        users.push({ _id, socketId });
};

const removeUser = (socketId) =>{
    users = users.filter( (user) => user.socketId !== socketId);
    //so if the user is in the array we delete them 
    //users will equal this new filtered array 

};


const getUser = (_id) =>{
    
    return users.find(user => user._id === _id);
}
io.on("connection", (socket) => {
  // ...
    // when connect
  console.log("a user connected");
    //after evry connection we will take user id and socketId from user
    //to take something from client we use "socket.on"
    socket.on("addUser", (_id) =>{
        addUser(_id, socket.id);
        io.emit("getUsers", users);
    });
    //so add process, we can send users in users array to every client

    // send and get message
    //messages will be sent from client side
    socket.on("sendMessage", ({senderId, receiverId, text}) =>{
        const user = getUser(receiverId);
        //we are sending to specific user we use io.to
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });




    socket.on("disconnect", ()=>{
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

});