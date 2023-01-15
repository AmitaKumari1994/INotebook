 const mongoose = require('mongoose');
 const mongoURI = `mongodb+srv://abhiscience:Mongo1234@abhinavcluster.b2daqtw.mongodb.net/abhiKart`;

 const connectToMongo = ()=>{
     mongoose.connect(mongoURI , ()=>{
         console.log("Connected to mongoose successfully");
     })
 }

 module.exports = connectToMongo;
