const express = require('express');
const connectDB = require('./config/db')

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));