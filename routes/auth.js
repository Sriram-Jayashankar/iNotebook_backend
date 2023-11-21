const express = require('express')
const router = express.Router()
const User = require("../models/User.js")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const { body, validationResult } = require('express-validator');
const fetchuserdetails=require("../middleware/fetchuserdetails.js")


JWT_SECRET="sriram@#$%5432"

// route 1:check with a post req in api/auth/create user No login required this is for user signup
router.post('/createuser',
    [body("name", "enter a valid name").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password with atleast 5 characters").isLength({ min: 5 })]
    ,
    async (req, res) => {
        //if there are errors return errors
        try{
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const k=await User.findOne({email:req.body.email})
        if(k)
        {
            return res.status(400).json({ errors: "sorry A user with the given email id already exists" })
        }
        const salt=await bcrypt.genSalt(10)
        const hashpwd=await bcrypt.hash(req.body.password,salt)
         const user=await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashpwd

        })
        const data={
            user:{id:user.id}
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        res.json({type:"success",authtoken:authtoken})
    }
    catch(error){
        console.log("theres an error given below"+error)
        res.status(500).send("theres an error given below")
    }
    })





//Route:2 Login 
router.post('/login',
[body("email", "enter a valid email").isEmail(),
body("password", "cannotbeblank").exists(),
]
,async (req, res) => {
    //if there are errors return errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    }
    const {email,password}=req.body
    try{
        let user=await User.findOne({email})
        if(!user)
        {
            return res.status(400).json({ errors: "Pls try to login correctly" })
        }
        const passwordcompare=await bcrypt.compare(password,user.password)
        if(!passwordcompare)
        {
            return res.status(400).json({ errors: "Pls try to login correct" })
        }
        const data={
            user:{id:user.id}
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        res.json({type:"success",authtoken:authtoken})

    }catch(error)
    {
        console.log("theres an error given below"+error)
        res.status(500).send("theres an internal server error")
    }
})




//Route:3 get user details
router.post('/getuser',fetchuserdetails
,async (req, res) => {
    try{
    //if there are errors return errors
    const userid=req.user.id
    const details=await User.findById(userid).select("-password")
    res.json({type:"success",details:details})
    }catch(error)
    {
        console.log("theres an error given below"+error)
        res.status(500).send("theres an internal server error")
    }
}
)
module.exports = router