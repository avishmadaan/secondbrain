"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareRouter = void 0;
const express_1 = require("express");
const linkModel_1 = require("../models/linkModel");
const authmiddleware_1 = require("../middleware/authmiddleware");
const contentModel_1 = require("../models/contentModel");
const utils_1 = require("../utils");
exports.shareRouter = (0, express_1.Router)();
exports.shareRouter.post("/share", authmiddleware_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    //@ts-ignore
    const userId = req.userId;
    if (share) {
        const existingLink = yield linkModel_1.LinkModal.findOne({
            userId
        });
        if (existingLink) {
            res.json({
                message: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield linkModel_1.LinkModal.create({
            userId,
            hash: hash
        });
        res.json({
            message: hash
        });
    }
    else {
        yield linkModel_1.LinkModal.deleteOne({
            userId
        });
        res.json({
            message: "Deleted Success"
        });
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
}));
exports.shareRouter.get("/public/:hash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.hash;
    const link = yield linkModel_1.LinkModal.findOne({
        hash
    });
    console.log(link);
    if (!link) {
        res.status(404).json({
            message: "No Such Hash Exists"
        });
        return;
    }
    try {
        const userId = link.userId;
        const content = yield contentModel_1.ContentModel.find({
            userId: userId
        });
        console.log("here is the content");
        console.log(content);
        res.status(200).json({
            message: "Content Found",
            content: content
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Sever Errorr"
        });
    }
}));
