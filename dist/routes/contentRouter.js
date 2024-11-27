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
const tagsModel_1 = require("../models/tagsModel");
exports.contentRouter = (0, express_1.Router)();
exports.contentRouter.use(authmiddleware_1.authmiddleware);
exports.contentRouter.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.default.object({
        link: zod_1.default.string(),
        type: zod_1.default.enum(contentModel_1.contentTypes),
        title: zod_1.default.string(),
        tags: zod_1.default.array(zod_1.default.string()),
        description: zod_1.default.string()
    });
    const safeParse = requiredBody.safeParse(req.body);
    if (!safeParse.success) {
        res.status(403).json({
            message: "Content Format is Not Correct",
            error: safeParse.error.errors
        });
        return;
    }
    const { link, type, title, tags, description } = safeParse.data;
    try {
        const tagIds = yield Promise.all(tags.map((tagTitle) => __awaiter(void 0, void 0, void 0, function* () {
            let tag = yield tagsModel_1.TagModel.findOne({ title: tagTitle });
            if (!tag) {
                tag = yield tagsModel_1.TagModel.create({ title: tagTitle });
            }
            return tag._id;
        })));
        //@ts-ignore
        const userId = req.userId;
        const content = yield contentModel_1.ContentModel.create({
            link,
            type,
            title,
            tags: tagIds,
            userId,
            description
        });
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
        res.status(403).json({
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
        console.log("userId" + " " + userId);
        const data = yield contentModel_1.ContentModel.find({
            userId
        }).populate("tags", "title");
        res.status(200).json({
            message: "Data Found",
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
exports.contentRouter.get("/getbytype/:reqType", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqType = req.params.reqType;
    console.log(reqType);
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
        console.log("userId" + " " + userId);
        const data = yield contentModel_1.ContentModel.find({
            userId,
            type: reqType
        }).populate("tags", "title");
        res.status(200).json({
            message: "Data Found",
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
exports.contentRouter.get("/getalltags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const tags = yield tagsModel_1.TagModel.find({
            _id: { $in: yield contentModel_1.ContentModel.distinct("tags", { userId })
            }
        });
        // Query: ContentModel.distinct("tags", { userId: "user123" })
        // Result: ["tag1", "tag2", "tag3"]
        // (because distinct eliminates duplicates).
        // TagModel.find({ _id: { $in: ["tag1", "tag2", "tag3"] } })
        res.status(200).json({
            message: "Tags fetched successfully",
            tags,
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
