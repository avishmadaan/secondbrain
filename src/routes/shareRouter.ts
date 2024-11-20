import {Router} from 'express';import { LinkModal } from '../models/linkModel';
import { authmiddleware } from '../middleware/authmiddleware';
import { ContentModel } from '../models/contentModel';
export const shareRouter = Router();



shareRouter.post("/share",authmiddleware, async (req, res)=> {


        const hash = req.body.hash;

        //@ts-ignore
        const userId = req.userId;

        try {

            await LinkModal.create({
                hash,
                userId
            })

            res.status(200).json({
                message:"Link Created",
                hash
            })
        }

        catch(e) {
            console.log(e);
    
            res.status(500).json({
                message:"Internal Server Error"
            })
        }



})

shareRouter.get("/public/:hash", async (req, res)=> {

    const hash = req.params.hash;

    const link = await LinkModal.findOne({
        hash
    })

    if(!link) {

        res.status(404).json({
            message:"No Such Hash Exists"
        })

        return;
    }

    try {

        const userId = link.userId;
        console.log("userId" +" "+userId)

        const content = await ContentModel.find({
            userId
        })

        res.status(200).json({
            message:"Content Found",
            content:content
        })
    }

    catch(e) {

        console.log(e);

        res.status(500).json({
            message:"Internal Sever Errorr"
        })
    }




})