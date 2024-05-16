const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yhl1173:1234@cluster0.8q6wuyt.mongodb.net/', {
      useNewUrlParser:true
    , useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

//

app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log('Example app listening on port ${port}!'));


