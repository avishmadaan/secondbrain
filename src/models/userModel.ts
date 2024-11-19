import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
    email:{
        type: String, 
        unique:true
    },
    password: String
})

export const UserModel = model( "User", UserSchema);
