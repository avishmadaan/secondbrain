import {Router} from 'express';
import { authmiddleware } from '../middleware/authmiddleware';

import { ContentModel } from '../models/contentModel';

export const contentRouter = Router();

contentRouter.use(authmiddleware);

contentRouter.get("/add" ,async (req, res)=> {

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

contentRouter.delete("/delete", (req, res)=> {

})