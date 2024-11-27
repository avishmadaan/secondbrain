import {Router} from 'express';import { LinkModal } from '../models/linkModel';
import { authmiddleware } from '../middleware/authmiddleware';
import { ContentModel } from '../models/contentModel';
import { random } from '../utils';
export const shareRouter = Router();



shareRouter.post("/share",authmiddleware, async (req, res)=> {

        const share = req.body.share;
        //@ts-ignore
        const userId = req.userId;

        if(share) {
            
            const existingLink = await LinkModal.findOne({
                userId
            })

            if(existingLink) {

                res.json({
                    message:existingLink.hash
                })

                return;
            }

            const hash = random(10);
          await  LinkModal.create({
            userId,
                hash: hash
            })

            res.json({
                message:hash
            })
        }
        else {
          await  LinkModal.deleteOne({
            userId
            })
            res.json({
                message:"Deleted Success"
            })
        }

        // const hash = req.body.hash;

        // //@ts-ignore
        // const userId = req.userId;

        // try {

        //     const link = await LinkModal.findOne({
        //         hash,
        //         userId
        //     })

        //     if(!link) {
        //         await LinkModal.create({
        //             hash,
        //             userId
        //         })
                
        //     }


        //     res.status(200).json({
        //         message:"Link Created",
        //         hash
        //     })
        // }

        // catch(e) {
        //     console.log(e);
    
        //     res.status(500).json({
        //         message:"Internal Server Error"
        //     })
        // }



})

shareRouter.get("/public/:hash", async (req, res)=> {

    const hash = req.params.hash;

    const link = await LinkModal.findOne({
        hash
    })

    console.log(link);

    if(!link) {

        res.status(404).json({
            message:"No Such Hash Exists"
        })

        return;
    }

    try {

        const userId = link.userId;

        

        const content = await ContentModel.find({
            userId:userId
        });

        console.log("here is the content")
        console.log(content);

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