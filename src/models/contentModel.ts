import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Schema.Types.ObjectId;

export const contentTypes =  ["tweet", "video", "document","link"] as const;


const ContentSchema = new Schema({
    link: {type:String},
    type: {type:String, enum:contentTypes, required:true},
    title:{type:String, required:true},
    tags: [{type: ObjectId, ref:'Tag'}],
    description:{type:String},
    userId: {type:ObjectId, ref:'User', required:true}
})

export const ContentModel = model("Content", ContentSchema);
