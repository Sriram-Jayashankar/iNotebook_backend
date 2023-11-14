const express = require('express')
const router = express.Router()
const User=require("../models/User.js")

const { body, validationResult } = require('express-validator');

router.post('/',async (req,res)=>{
    console.log(req.body)
    const user=new User(req.body)
    await user.save()
    res.send(req.body)
})

module.exports = router