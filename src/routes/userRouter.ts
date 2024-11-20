import {Router} from 'express'
import z from "zod";
import bcrypt from "bcrypt";
import { UserModel } from '../models/userModel';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const userRouter = Router();

userRouter.post("/signup", async (req, res)=> {

    const requiredBody = z.object({
        email:z.string().email(),
        password:z.string().min(5, {message:"Minimum length is 5"}).max(16)

    })
    const parsedData = requiredBody.safeParse(req.body);
    
    if(!parsedData.success) {
        res.json({
            message:"Incorrect Format",
            error: parsedData.error,
        })
        return;
    }

    const email = req.body.email;
    const password =  req.body.password;

    const hashedPassword = await bcrypt.hash(password,10);

    try {
        await UserModel.create({
            email,
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


userRouter.post("/signin", async (req, res)=> {

    const email = req.body.email;
    const password =  req.body.password;

    const user = await UserModel.findOne({
        email
    })

    if(!user) {

        res.status(403).json({
            message:"User Does Not Exist"
        });

        return;
    }

    const comparePassword = await bcrypt.compare(password, user.password as string)



    try {
   
        if(comparePassword) {

            console.log("userId Here")
            console.log(user._id);
            const token = jwt.sign({
               id: user._id.toString(),

            }, JWT_SECRET as string)

            res.status(200).json({
                message:"Signin Success",
                token
            })
        }

        else {
            res.status(411).json({
                message:"Incorrect Password"
            })
        }

    }

    catch(e){
        console.log(e);

       res.status(500).json({
        message:"Server Error"
       })
    }



})
