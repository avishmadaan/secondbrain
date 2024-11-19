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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentRouter = void 0;
const express_1 = require("express");
const authmiddleware_1 = require("../middleware/authmiddleware");
const contentModel_1 = require("../models/contentModel");
const zod_1 = __importDefault(require("zod"));
const userModel_1 = require("../models/userModel");
exports.contentRouter = (0, express_1.Router)();
exports.contentRouter.use(authmiddleware_1.authmiddleware);
exports.contentRouter.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.default.object({
        link: zod_1.default.string().min(1),
        type: zod_1.default.string(),
        title: zod_1.default.string()
        //need to work here
    });
    const safeParse = requiredBody.safeParse(req.body);
    if (!safeParse.success) {
        res.status(403).json({
            message: "Content Format is Not Correct"
        });
        return;
    }
    try {
        console.log("reached here");
        const content = yield contentModel_1.ContentModel.create(req.body);
        res.status(200).json({
            message: "Content Created Successfully"
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
exports.contentRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.id;
    const content = yield contentModel_1.ContentModel.findOne({
        _id: contentId
    });
    if (!content) {
        res.status(404).json({
            message: "No content Like that"
        });
        return;
    }
    //@ts-ignore
    if (content._id != contentId) {
        res.status(404).json({
            message: "Not Enough Access1"
        });
        return;
    }
    try {
        yield contentModel_1.ContentModel.deleteOne({
            _id: contentId
        });
        res.status(200).json({
            message: "Deletion Success"
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
exports.contentRouter.get("/getall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const user = yield userModel_1.UserModel.findOne({
        _id: userId
    });
    if (!user) {
        res.status(404).json({
            message: "No Such User"
        });
        return;
    }
    try {
        const data = yield contentModel_1.ContentModel.find({
            userId
        });
        res.status(200).json({
            content: data
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
