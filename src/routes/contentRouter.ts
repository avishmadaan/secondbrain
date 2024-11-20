import {Router} from 'express';
import { authmiddleware } from '../middleware/authmiddleware';

import { ContentModel } from '../models/contentModel';

import z from "zod";
import { UserModel } from '../models/userModel';

export const contentRouter = Router();

contentRouter.use(authmiddleware);

contentRouter.post("/add" ,async (req, res)=> {

    const requiredBody = z.object({
        link:z.string().min(1),
        type:z.string(),
        title:z.string()

        //need to work here
    })

    const safeParse = requiredBody.safeParse(req.body)

    if(!safeParse.success) {

        res.status(403).json({
            message:"Content Format is Not Correct"
        })
        return;

    }

    try {
        console.log("reached here")

        const content = await ContentModel.create(req.body);

        res.status(200).json({
            message:"Content Created Successfully"
        })

    }

    catch(e) {
        console.log(e);

        res.status(500).json({
            message:"Internal Server Error"
        })
    }

})

contentRouter.delete("/delete/:id", async (req, res)=> {

    const contentId = req.params.id;

    const content = await ContentModel.findOne({
        _id:contentId
    })


    if(!content) {
        res.status(404).json({
            message:"No content Like that"
        })
        return;
    }
//@ts-ignore
    if(content._id != contentId) {

        res.status(404).json({
            message:"Not Enough Access1"
        })
        return;
 
    }

    try {

        await ContentModel.deleteOne({
            _id:contentId
        })

        res.status(200).json({
            message:"Deletion Success"
        })
    }

    catch(e)  {

        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }




})




contentRouter.get("/getall", async (req, res)=> {

    //@ts-ignore
    const userId = req.userId;
    const user =await UserModel.findOne({
        _id:userId
    })


    if(!user) {

        res.status(404).json({
            message:"No Such User"
        })
        return;
    }

    try {
        console.log("userId" +" "+ userId);

        const data = await ContentModel.find({
            userId
        }).populate("userId","email" )

        res.status(200).json({
            message:"Data Found",
            content:data
        })
    }

    catch(e) {
        console.log(e);

        res.status(500).json({
            message:"Internal Server Error"
        })
    }

    

});