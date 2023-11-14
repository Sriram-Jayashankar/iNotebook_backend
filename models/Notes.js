const mongoose=require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:"user"
  },
  title :{
    type :String,
    required :true
  },
  description :{
    type :String,
    required :true,
    unique :true
  } ,
  tag :{
    type :String,
    default:"general"
  },
  date :{
    type :Date,
    default:Date.now
  }
  
});
const Notes=mongoose.model('notes',notesSchema);
module.exports =Notes