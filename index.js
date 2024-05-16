// import React정적 import 
// require 동적 import

const express = require('express')
const app = express()
const port = 5000
const {User} = require("./models/User");
const bodyParser = require("body-parser");

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yhl1173:fkaus55@cluster0.8q6wuyt.mongodb.net/', {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('err = ' + err))

app.get('/', (req, res) => res.send('Hello World'))

app.post('/register', (req, res) => {
    // 회원가입에 필요한정보를 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);
    user.save((err,userInfo) => {
        console.log("err : " + err);
        console.log("userInfo : " + userInfo);
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    })


})

app.listen(port, () => console.log('Example app listening on port ${port}!'));


