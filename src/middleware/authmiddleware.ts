import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";
import { NextFunction, Request, Response } from "express";


export const authmiddleware = (
    req:Request, 
    res:Response, 
    next:NextFunction) => {

    const token = req.headers.authorization;

    const decoded = jwt.verify(token as string, JWT_SECRET  as string);


    if(decoded){
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }

    else {
        res.status(403).json({
            message:"You are not logged In"
        })
    }


}