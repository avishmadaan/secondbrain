import express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import z from "zod";
import bcrypt from "bcrypt"
import { UserModel, ContentModel } from "./db";
import dotenv from "dotenv";
import { JWT_PASSWORD } from "./config";
import { authmiddleware } from "./middleware/authmiddleware";

dotenv.config();

const app = express();
app.use(express.json());



app.post("/api/v1/signup", async (req, res)=> {

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

app.post("/api/v1/signin", (req, res)=> {

    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.findOne({
        username:username
    })

        const passwordMatch = await bcrypt.compare(password, user.password);


    if(user && passwordMatch) {
        const token = jwt.sign({
            id:user._id.toString()
        }, JWT_PASSWORD);

        res.status(200).json({
            token
        })
    }

    else {

        res.status(403).json({
            message:"Incorrect creds"
        })
    }


})

app.get("/api/v1/content", authmiddleware ,(req, res)=> {

    const link = req.body.link;
    const type = req.body.type;

    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })

    res.json({
        message:"Content Added"
    })

})

app.delete("/api/v1/content", (req, res)=> {

})

app.post("/api/v1/brain/share", (req, res)=> {

})

app.get("/api/v1/brain/share/link", (req, res)=> {

})


app.listen(process.env.PORT);

