import {Router} from 'express';
import { authmiddleware } from '../middleware/authmiddleware';

import { ContentModel, contentTypes } from '../models/contentModel';

import z from "zod";
import { UserModel } from '../models/userModel';
import { TagModel } from '../models/tagsModel';

export const contentRouter = Router();

contentRouter.use(authmiddleware);

contentRouter.post("/add" ,async (req, res)=> {

    const requiredBody = z.object({
        link:z.string(),
        type:z.enum(contentTypes),
        title:z.string(),
        tags:z.array(z.string())
    })

    const safeParse = requiredBody.safeParse(req.body)

    if(!safeParse.success) {

        res.status(403).json({
            message:"Content Format is Not Correct",
            error: safeParse.error.errors
        })
        return;

    }

    const {link, type, title, tags} = safeParse.data;

    try {
       const tagIds = await Promise.all(
        tags.map(async (tagTitle) => {
            let tag = await TagModel.findOne({title:tagTitle});

            if(!tag) {
                tag = await TagModel.create({title:tagTitle})
            }

            return tag._id;

        })
       )

//@ts-ignore
       const userId = req.userId;

        const content = await ContentModel.create({
            link, 
            type, 
            title, 
            tags : tagIds,
            userId,
        } ); 

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

        res.status(403).json({
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
        }).populate("tags","title" )

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


contentRouter.get("/getalltags", async (req, res)=> {

    //@ts-ignore
    const userId = req.userId;

    try {


   

    const tags = await TagModel.find({
        _id: {$in : await ContentModel.distinct("tags", {userId})

        }
    })

    // Query: ContentModel.distinct("tags", { userId: "user123" })

    // Result: ["tag1", "tag2", "tag3"]
    // (because distinct eliminates duplicates).

    // TagModel.find({ _id: { $in: ["tag1", "tag2", "tag3"] } })

    res.status(200).json({
        message: "Tags fetched successfully",
        tags,
    });
} catch (e) {
    console.error(e);
    res.status(500).json({
        message: "Internal Server Error",
    });
}

  

})
