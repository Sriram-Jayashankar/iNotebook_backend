const express=require('express')
const router =express.Router()
const Notes=require("../models/Notes.js")
const fetchuserdetails=require("../middleware/fetchuserdetails.js")
const { body, validationResult } = require('express-validator');


//route 1: to fetchallnotes
router.get('/fetchnotes',fetchuserdetails,async (req,res)=>{
    try
    {
        const userid=req.user.id
        const allnotes=await Notes.find({user:userid})
        res.json(allnotes)



    }catch(error){
        res.status(500).send("theres an error given below")
    }
})

//route 2: to create and add a note
router.post('/createnote',fetchuserdetails,[
    body("title", "enter a valid title").isLength({ min: 5 }),
    body("description", "enter a valid description").isLength({ min: 5 })
],async (req,res)=>{
    try
    {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        let {title,description,tag}=req.body
        const userid=req.user.id
        const note= new Notes(
            {
                user:userid,
                title:title,
                description:description,
                tag:tag
            }
        )
        const savednote=await note.save()
        res.json(savednote)
    }catch(error){
        console.log(error)
        res.status(500).send("theres an error given below")
    }
})


//route 3: to update a given note using title
router.post('/updatenote',fetchuserdetails,[
    body("title", "enter a valid title to be searched").isLength({ min: 5 }),
    body("new_title", "enter a valid title").isLength({ min: 5 }),
    body("new_description", "enter a valid description").isLength({ min: 5 })

],async (req,res)=>{
    try
    {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        let {title,new_title,new_description}=req.body
        const userid=req.user.id
        //find note with that id
        const note = await Notes.updateMany(
            { title: title, userId: userid }, // Specify the conditions to match
            { $set: { title: new_title, description: new_description } } // Specify the update operation
        );
        if (result.nModified > 0) {
            res.send("updated succesfully ")
        }
        else
        {
            res.send("no change ")

        }
    }catch(error){
        console.log(error)
        res.status(500).send("theres an error given below")
    }
})
module.exports=router