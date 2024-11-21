import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

const tagSchema = new Schema({
    title:{type:String, unique:true}
    
})

export const TagModel = model( "Tag", tagSchema);
