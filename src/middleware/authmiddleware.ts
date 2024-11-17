import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config";
import { NextFunction, Request, Response } from "express";


export const authmiddleware = (req:Request, res:Response, next:NextFunction) => {

    const token = req.headers.authorization;

    const response = jwt.verify(token as string, JWT_PASSWORD);

    if(response){
        //@ts-ignore
        req.userId = token.id;
        next();
    }

    else {
        res.status(403).json({
            message:"You are not logged In"
        })
    }


}