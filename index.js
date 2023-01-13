 const connectToMongo = require('./db');
 const express = require('express');
 const cors = require('cors');
 connectToMongo();

// var express = require('express')

// var app = express()



 const app = express()
 const port = 5000;

 app.use(express.json());
 app.use(cors())

 //Available Routes
 app.use('/api/auth',require('./routes/auth'))
 app.use('/api/notes',require('./routes/notes'))

//  app.get('/',(req,res) => {
//      res.send("Hello world");
//  })

 app.listen(port, ()=>{
     console.log(`Example app listening at http://localhost:${port}`)
 })

// const express = require("express");
// const mongoose = require("mongoose");

// const app = express()
// mongoose.connect("mongodb://127.0.0.1:27017/abhiKart",{useNewUrlParser:true , useUnifiedTopology:true},(err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log("successfully connected")
//     }
// })


// app.listen(3000, ()=>{
    
//     console.log("on port 3000!!!")
// })

// app.get('/',(req,res)=>{
//     res.send('Hello abhinav')
// })