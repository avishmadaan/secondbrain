import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

export const contentTypes = ["image", "video","articles","audio", "tweet", "youtube"] as const;


const ContentSchema = new Schema({
    link: {type:String, required:true},
    type: {type:String, enum:contentTypes, required:true},
    title:{type:String, required:true},
    tags: [{type: ObjectId, ref:'Tag'}],
    userId: {type:ObjectId, ref:'User', required:true}
})

export const ContentModel = model("Content", ContentSchema);
