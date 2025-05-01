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
const express_1 = __importDefault(require("express"));
const status_types_1 = require("../types/status.types");
const mongoose_1 = __importDefault(require("mongoose"));
const link_model_1 = require("../models/link.model");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const linkRouter = express_1.default.Router();
linkRouter.get("/check", (req, res, next) => {
    try {
        res.status(200).json({
            msg: "Hi this is Link Router"
        });
    }
    catch (error) {
        next(error);
    }
});
linkRouter.post("/", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { contentId } = req.body;
        if (!userId || !contentId) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                msg: "No userId or contentId provided",
                success: status_types_1.ApiStatus.Warning
            });
        }
        const user_id = new mongoose_1.default.Types.ObjectId(userId);
        const content_id = new mongoose_1.default.Types.ObjectId(contentId);
        const existingLink = yield link_model_1.LinkModel.findOne({ userId: user_id, contentId: content_id });
        if (existingLink) {
            return res.status(status_types_1.HttpStatus.Conflict).json({
                msg: "Link already exists",
                success: status_types_1.ApiStatus.Warning
            });
        }
        const link = yield link_model_1.LinkModel.create({
            userId: user_id,
            contentId: content_id
        });
        res.status(status_types_1.HttpStatus.Created).json({
            msg: "Link created successfully",
            success: status_types_1.ApiStatus.Success,
            data: link
        });
    }
    catch (error) {
        console.error("Create Link Error:", error);
        next(error);
    }
}));
linkRouter.get("/", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const linkId = req.query.linkId;
        if (!userId || !linkId) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                msg: "No userId or linkId provided",
                success: status_types_1.ApiStatus.Warning,
            });
        }
        const user_id = new mongoose_1.default.Types.ObjectId(userId);
        const linke = yield link_model_1.LinkModel.findOne({
            userId: user_id,
            contentId: linkId,
        })
            .populate("userId", "-password -__v -createdAt -updatedAt")
            .populate({
            path: "contentId",
            select: "-embedding -__v",
            populate: {
                path: "tags",
                model: "TagModel",
                select: "title",
            },
        });
        if (!linke) {
            return res.status(status_types_1.HttpStatus.NotFound).json({
                msg: "Link Not Found",
                success: status_types_1.ApiStatus.Warning,
            });
        }
        res.status(status_types_1.HttpStatus.OK).json({
            msg: "Links retrieved successfully",
            success: status_types_1.ApiStatus.Success,
            data: linke,
        });
    }
    catch (error) {
        console.error("Get Links Error:", error);
        next(error);
    }
}));
exports.default = linkRouter;
