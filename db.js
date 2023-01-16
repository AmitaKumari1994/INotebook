 const mongoose = require('mongoose');
//  const mongoURI = `mongodb://127.0.0.1:27017/abhiKart`;
 const mongoURI =`mongodb+srv://abhiscience:Mongo1234@abhinavcluster.b2daqtw.mongodb.net/abhiKart?retryWrites=true&w=majority`


 const connectionParams ={
    useNewUrlParser :true,
    useUnifiedTopology:true

 }
 const connectToMongo = ()=>{
     mongoose.connect(mongoURI ,connectionParams).then(()=>{
        console.info("connected to db");
     }).catch((e)=>{
        console.log("error")
     })
 }

 module.exports = connectToMongo;
//  const mongoose = require('mongoose');
//  const mongoURI = `mongodb+srv://abhiscience:Mongo1234@abhinavcluster.b2daqtw.mongodb.net/abhiKart`;

//  const connectToMongo = ()=>{
//      mongoose.connect(mongoURI , ()=>{
//          console.log("Connected to mongoose successfully");
//      })
//  }

//  module.exports = connectToMongo;
