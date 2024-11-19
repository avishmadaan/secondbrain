import {Router} from 'express'
import z from "zod";
import bcrypt from "bcrypt";
import { UserModel } from '../models/userModel';

export const userRouter = Router();

userRouter.post("/signup", async (req, res)=> {

    const requiredBody = z.object({
        username:z.string().email(),
        password:z.string().min(5).max(10)

    })
    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message:"Incorrect Format",
            error: parsedData.error.issues[0].message,
        })
        return;
    }

    const username = req.body.username;
    const password =  req.body.password;

    const hashedPassword = await bcrypt.hash(password,10);

    try {
        await UserModel.create({
            username,
            password:hashedPassword
        })

        res.json({
            message:"Account Creation Success"
        })


    }

    catch(e){

       res.status(411).json({
        message:"User Already Exist"
       })
    }



})


userRouter.post("/api/v1/signin", async (req, res)=> {

    const requiredBody = z.object({
        username:z.string().email(),
        password:z.string().min(5).max(10)

    })
    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message:"Incorrect Format",
            error: parsedData.error.issues[0].message,
        })
        return;
    }

    const username = req.body.username;
    const password =  req.body.password;

    const hashedPassword = await bcrypt.hash(password,10);

    try {
        await UserModel.create({
            username,
            password:hashedPassword
        })

        res.json({
            message:"Account Creation Success"
        })


    }

    catch(e){

       res.status(411).json({
        message:"User Already Exist"
       })
    }



})
