import mongoose, { Model } from "mongoose"

const Schema = mongoose.Schema;

const User = new Schema({
    userName:{type: String, unique:true},
    password: String
})

export const UserModel = new Model(User, "Usermodel")


