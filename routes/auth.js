const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');

const JWT_SECRET = "Abhinav"

//Create a user using POST endpoint /createuser: No login required

router.post('/createuser',[
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
],async (req,res)=>{
    let success = false;

    // If there are errors , return errors and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //check whether the user with this email already exists
    try {
        
    
    let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({success,error : "A user with this email already exists . Try with new emailID"})
    }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt);
    //create a new user
   user = await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass
      })

      const data ={
        user:{
          id:user.id
        }
      }

      const authtoken = jwt.sign(data,JWT_SECRET);
      // console.log(jwtData);
      let success = true
      res.json({success,authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
        
    }

    // since we are using async await so we are removing .then  
    //   .then(user => res.json(user))
    //   .catch(err => {console.log(err)
    //     res.json({error:"Please enter a unique value for email",message:err.message})});
//    console.log(req.body);
//    const user = User(req.body);
//    user.save();
//    res.send("Hello again")
})

//Authenticate a user using POST endpoint "/api/auth/login". No login required
router.post('/login',[
  
  body('email','Enter a valid email').isEmail(),
  body('password','password cannot be blank').exists()
],async (req,res)=>{
  let success = false;
  // If there are errors , return errors and bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
}

  const{email,password}=req.body;
  try {
    let user = await User.findOne({email})
    if(!user){
      // let success = false
      return res.status(400).json({success , error: "Please try to login with correct credentials"});
    }

    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      // let success = false;
      return res.status(400).json({success ,error: "Please try to login with correct credentials"});
    }


    const data ={
      user:{
        id:user.id
      }
    }

    const authtoken = jwt.sign(data,JWT_SECRET);
    let success = true;
    res.json({success,authtoken})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error")
  }
})

//Route: 3 Get logged in user details using post method "api/auth/getuser" Login required

router.post('/getuser',fetchuser, async(req,res)=>{
  try{
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error")
  }
})
// Router:3 update an existing note using POST "api/auth/updatenote". Login required

router.put('/updatenote/:id',fetchuser, async(req,res)=>{
  const {title, description, tag} = req.body
  // create a newnote object
  const newNote={}
  if(title){newNote.title = title};
  if(description){newNote.description = description};
  if(tag){newNote.tag = tag};

  // Find the note to be updated and update it
  let note =await Note.findById(req.params.id)
  if(!note){return res.status(404).send("Not found")}

  if(note.user.tostring!==req.user.id){
    return res.status(401).send("Not allowed")
  }

  note = await Note.findByIdAndUpdate(req.params.id ,{$set:newNote},{new:true})
  res.json({note})

})
module.exports = router;