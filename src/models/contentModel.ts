import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;


const ContentSchema = new Schema({
    link: String,
    type: String,
    title:String,
    tags: [{type: ObjectId, ref:'Tag'}],
    userId: {type:ObjectId, ref:'User'}
})

export const ContentModel = model("ContentSchema", ContentSchema);
