const mongoose=require('mongoose')
const mongouri='mongodb://localhost:27017/'

const connectToMongo =()=>
{
    mongoose.connect(mongouri).then(console.log("connected to mongoose")).catch((e)=>{console.log(e)})
}

module.exports =connectToMongo;