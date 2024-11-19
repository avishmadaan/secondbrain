import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

const tagSchema = new Schema({
    title:{type:String, required:true, unique:true}
    
})

export const TagModel = model( "Tag", tagSchema);
