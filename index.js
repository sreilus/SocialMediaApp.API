const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port =  3500;

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const universitieRoute = require('./routes/universities');

dotenv.config();

//Connect DB
mongoose.connect(
    "mongodb+srv://sreilus:147896352@cluster0-jgfx4.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true 
    },

    () => console.log("Connected to DB")
);

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/universities', universitieRoute);

app.listen(port, () => console.log('Server Up and running on ' + port));

