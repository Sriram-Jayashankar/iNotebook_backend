const express=require('express')
const router =express.Router()


router.get('/',(req,res)=>{
    obg={
        name:"a",
        allah:"b"
    }
    res.json(obg)
})

module.exports=router