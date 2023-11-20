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
        res.json({savednote})
    }catch(error){
        console.log(error)
        res.status(500).send("theres an error given below")
    }
})


//route 3: to update a given note using title
router.post('/updatenote/:id',fetchuserdetails,[
    body("title", "enter a valid title").isLength({ min: 5 }),
    body("description", "enter a valid description").isLength({ min: 5 })
],async (req,res)=>{
    try
    {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const userid=req.user.id
        let {title,description,tag}=req.body

        //create a new note 
        const newnote= {
            user:userid,
            title:title,
            description:description,
            tag:tag
        }

        const note=await Notes.findById(req.params.id)
        if(!note)
        {
            return res.status(400).send("unsuccessful")
        }
        //if a user is trying to access another note
        if(note.user != userid)
        {
            console.log(note.user)

            return res.status(401).send("not allowed")
        }
        updatednote=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
        res.json(updatednote)
    }catch(error){
        console.log(error)
        res.status(500).send("theres an error given below")
    }
})



//route to .deleete to delete a aprticular node with the delete req
router.delete('/deletenode/:id',fetchuserdetails,async (req,res)=>{
    try
    {
        const userid=req.user.id
        const note=await Notes.findById(req.params.id)
        if(!note)
        {
            return res.status(400).send("unsuccessful")
        }
        //if a user is trying to access another note
        if(note.user.toString() != userid)
        {
            return res.status(401).send("not allowed")
        }
        updatednote=await Notes.findByIdAndDelete(req.params.id)
        res.json(updatednote)
    }catch(error){
        console.log(error)
        res.status(500).send("theres an error given below")
    }
})
module.exports=router