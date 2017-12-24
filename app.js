const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

var users = require('./routes/users');

mongoose.connect(config.database);
mongoose.connection.on('connected',()=>{
    console.log('db connected to '+config.database);
});
mongoose.connection.on('error',(err)=>{
    console.log('db error  '+err);
})

var app = express();

app.use(cors());

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users',users);

app.get('/',(req,res)=>{
    res.send('Invalid endpoint');
});
app.get('*',(req,res)=>{
    res.sendFile('index.html');
});

app.set('port',process.env.PORT || 8080);
app.listen(app.get('port'),()=>{
    console.log('Server started at '+app.get('port'));
});