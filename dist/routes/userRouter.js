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
exports.userRouter = void 0;
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../models/userModel");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.default.object({
        username: zod_1.default.string().email(),
        password: zod_1.default.string().min(5).max(10)
    });
    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect Format",
            error: parsedData.error.issues[0].message,
        });
        return;
    }
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        yield userModel_1.UserModel.create({
            username,
            password: hashedPassword
        });
        res.json({
            message: "Account Creation Success"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User Already Exist"
        });
    }
}));
exports.userRouter.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.default.object({
        username: zod_1.default.string().email(),
        password: zod_1.default.string().min(5).max(10)
    });
    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect Format",
            error: parsedData.error.issues[0].message,
        });
        return;
    }
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        yield userModel_1.UserModel.create({
            username,
            password: hashedPassword
        });
        res.json({
            message: "Account Creation Success"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User Already Exist"
        });
    }
}));
