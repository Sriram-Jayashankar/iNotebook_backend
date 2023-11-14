const express = require('express')
const router = express.Router()
const User = require("../models/User.js")
const bcrypt=require("bcryptjs")
const { body, validationResult } = require('express-validator');

//check with a post req in api/auth/create user No login required this is for user signup
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
        console.log(k)
        if(k)
        {
            return res.status(400).json({ errors: "sorry A user with the given email id already exists" })
        }
        const salt=await bcrypt.genSalt(10)
        const hashpwd=await bcrypt.hash(req.body.password,salt)
        console.log(hashpwd)
         const user=await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashpwd

        })
        res.send(user)
    }
    catch(error){
        console.log("theres an error given below"+error)
        res.status(500).send("theres an error given below")
    }
    })





//check with a post req in api/auth/login user No login required
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
    const {name,email,password}=req.body
    try{
        let user=User.findOne({email})
        if(user)
        {
            return res.status(400).json({ errors: "Pls try to login correct" })
        }
        const passwordcompare=bcry

    }catch(error)
    {

    }
})
module.exports = router