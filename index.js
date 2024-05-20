// import React정적 import 
// require 동적 import

const express = require('express')
const app = express()
const port = 5000
const {User} = require("./models/User");
const { auth } = require('./middleware/auth')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yhl1173:fkaus55@cluster0.8q6wuyt.mongodb.net/', {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('err = ' + err))

app.get('/', (req, res) => res.send('a'))

app.post('/register', (req, res) => {
    // 회원가입에 필요한정보를 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);
    user.save((err,userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "해당 이메일에 해당하는 유저가 없습니다."
      })
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        })
      }
      user.generateToken((err, user) => {
        if(err) {
          return res.status(400).send(err)
        }
                
        res.cookie("x_auth", user.token)
        .status(200)
        .json({
          loginSuccess: true,
          userId: user._id
        })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  console.log("auth 확인")

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, 
      {token:""}
      , (err, user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
          success: true
        })
      }
    )  
})


app.listen(port, () => console.log('Example app listening on port ${port}!'));


