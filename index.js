const express = require('express')
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // bodyparser

const config = require('./config/key');

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const mongoose = require('mongoose')
console.log(config.mongoURI)
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected.."))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', async (req, res) => {
  //회원가입시 필요 정보를 client에서 가져오면
  //데이터베이스에 삽입한다


  //body parser를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body)

  //mongoDB 메서드, user모델에 저장
  const result = await user.save().then(()=>{
    res.status(200).json({
      success: true
    })
  }).catch((err)=>{
    res.json({ success: false, err })
  })
})




app.post('/login',async(req, res) =>{ 
  // 요청된 이메일을 데이터베이스 찾기
  User.findOne({email: req.body.email})
  .then(docs=>{
      if(!docs){
          return res.json({
              loginSuccess: false,
              messsage: "제공된 이메일에 해당하는 유저가 없습니다."
          })
      } else {
      }
      docs.comparePassword(req.body.password, (err, isMatch) => {
          if(!isMatch) return res.json({loginSuccess: false, messsage: "비밀번호가 틀렸습니다."})
          // Password가 일치하다면 토큰 생성
          docs.generateToken((err, user)=>{
              if(err) return res.status(400).send(err);
              // 토큰을 저장
              res.cookie("x_auth", user.token)
              .status(200)
              .json({loginSuccess: true, userId: user._id})
          })
      })
  })
  .catch((err)=>{
      console.log(err)
      return res.status(400).send(err);
  })
})


// app.post('/login', (req, res) => {
//   User.findOne({ email: req.body.email}, (err, userInfo) => {
//     if(!userInfo) {
//       return res.json({
//         loginSuccess: false,
//         message: "제공된 이메일에 해당된 유저가 없습니다."
//       })
//     }

//     user.comparePassword(req.body.password, (err, isMatch) => {
//       if(!isMatch)
//       return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

//       user.generateToken((err, user) => {
//           if(err) return res.status(400).send(err);

//           // 토큰을 저장 
//           res.cookie('x_auth', user.token)
//           .status(200)
//           .json({loginSuccess: true, userId: user._id})

//       })
//     })
//   })
// })

app.post('/api/users/auth',auth , (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})