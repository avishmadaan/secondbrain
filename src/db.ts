import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

mongoose.connect("mongodb+srv://avishmadaaan:9799937376@cluster0.5ustp.mongodb.net/")

const UserSchema = new Schema({
    username:{type: String, unique:true},
    password: String
})

export const UserModel = model( "Usermodel", UserSchema);

const ContentSchema = new Schema({
    link: String,
    type: String,
    title:String,
    tags: [{type: ObjectId, ref:'Tag'}],
    userId: {type:ObjectId, ref:'User'}
})

export const ContentModel = model("ContentSchema", ContentSchema);


