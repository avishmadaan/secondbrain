import mongoose, { model, Schema } from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
    username:{type: String, unique:true},
    password: String
})

export const UserModel = model( "Usermodel", UserSchema);
