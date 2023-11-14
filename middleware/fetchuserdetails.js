const jwt=require("jsonwebtoken")
JWT_SECRET="sriram@#$%5432"


const fetchuserdetails=(req,res,next)=>{
   
    const auth=req.header("authtoken");
    if(!auth)
    {
         res.status(401).json({ errors: "invalid auth token" })
    }
    try{
        const data=jwt.verify(auth,JWT_SECRET);
        req.user=data.user;
        next();
    }catch(error)
    {
        res.status(401).json({ errors: "invalid auth token" })

    }
    
}


module.exports=fetchuserdetails