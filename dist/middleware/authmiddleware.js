"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authmiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authmiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    const response = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
    if (response) {
        //@ts-ignore
        req.userId = token.id;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not logged In"
        });
    }
};
exports.authmiddleware = authmiddleware;
