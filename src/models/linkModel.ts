import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

const LinkSchema = new Schema({
   
    hash:{type:String, required:true, unique:true},
    userId:{type:ObjectId, ref:'User', required:true}

})

export const LinkModal = model( "Link", LinkSchema);
