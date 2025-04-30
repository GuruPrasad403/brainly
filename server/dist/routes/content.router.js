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
const express_1 = __importDefault(require("express"));
const status_types_1 = require("../types/status.types");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const content_validations_1 = require("../validations/content.validations");
const content_model_1 = require("../models/content.model");
const types_model_1 = require("../models/types.model");
const mongoose_1 = __importDefault(require("mongoose"));
const contnet_types_1 = require("../types/contnet.types");
const huggingface_utils_1 = require("../utils/huggingface.utils");
const cosineSimilarity_utils_1 = require("../utils/cosineSimilarity.utils");
exports.contentRouter = express_1.default.Router();
exports.contentRouter.get("/", (req, res, next) => {
    try {
        res.status(status_types_1.HttpStatus.Accepted).json({
            msg: "This is a Content Router",
            success: status_types_1.ApiStatus.Success,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.contentRouter.post("/content", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const valid = content_validations_1.contentSchema.safeParse(req.body);
        if (!valid.success) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                success: status_types_1.ApiStatus.Error,
                msg: "Invalid Inputs",
                error: valid === null || valid === void 0 ? void 0 : valid.error.errors,
            });
        }
        const { link, title, type, description, tags: tagTitles } = valid.data;
        const tagIds = [];
        if (tagTitles) {
            for (const tagTitle of tagTitles) {
                let tag = yield types_model_1.TagModel.findOne({ title: tagTitle });
                if (!tag) {
                    tag = yield types_model_1.TagModel.create({ title: tagTitle });
                }
                tagIds.push(tag._id);
            }
        }
        else {
            console.log("No tags provided");
        }
        const fullText = `${title} ${description} ${link}`;
        const embedding = yield (0, huggingface_utils_1.getTextEmbedding)(fullText);
        const content = yield content_model_1.ContentModel.create({
            userId,
            link,
            title,
            type,
            description,
            tags: tagIds,
            embedding,
        });
        return res.status(status_types_1.HttpStatus.Created).json({
            success: status_types_1.ApiStatus.Success,
            msg: "Content created successfully",
            data: content,
        });
    }
    catch (error) {
        console.error("Error in /content:", error);
        next(error);
    }
}));
exports.contentRouter.put("/", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const _id = new mongoose_1.default.Types.ObjectId(id);
        if (!_id || !mongoose_1.default.Types.ObjectId.isValid(_id)) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                success: status_types_1.ApiStatus.Error,
                msg: "Invalid content ID",
            });
        }
        const valid = content_validations_1.contentSchema.safeParse(req.body);
        if (!valid.success) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                success: status_types_1.ApiStatus.Error,
                msg: "Invalid Inputs",
                error: valid.error.errors,
            });
        }
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const findContent = yield content_model_1.ContentModel.findById(_id).session(session);
            if (!findContent) {
                yield session.abortTransaction();
                return res.status(status_types_1.HttpStatus.BadRequest).json({
                    msg: "No data to update",
                    success: status_types_1.ApiStatus.Info,
                });
            }
            findContent.title = valid.data.title;
            findContent.link = valid.data.link;
            findContent.type = valid.data.type;
            findContent.description = valid.data.description;
            const updatedText = `${valid.data.title} ${valid.data.description} ${valid.data.link}`;
            const embedding = yield (0, huggingface_utils_1.getTextEmbedding)(updatedText);
            findContent.embedding = embedding;
            if (valid.data.tags) {
                const tagIds = [];
                for (const tagTitle of valid.data.tags) {
                    let tag = yield types_model_1.TagModel.findOne({ title: tagTitle });
                    if (!tag)
                        tag = yield types_model_1.TagModel.create({ title: tagTitle });
                    tagIds.push(tag._id);
                }
                findContent.tags = tagIds;
            }
            yield findContent.save({ session });
            yield session.commitTransaction();
            session.endSession();
            return res.status(status_types_1.HttpStatus.Accepted).json({
                success: status_types_1.ApiStatus.Success,
                msg: "Content updated successfully",
                data: { _id: findContent._id,
                    title: findContent.title,
                    link: findContent.link,
                    type: findContent.type,
                    description: findContent.description,
                    tags: findContent.tags,
                    userId: findContent.userId,
                }
            });
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            console.error(error);
            next(error);
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.contentRouter.delete("/", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                success: status_types_1.ApiStatus.Info,
                msg: "Invalid or missing ID",
            });
        }
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const content = yield content_model_1.ContentModel.findByIdAndDelete({ _id: id }, { session });
            if (!content) {
                yield session.abortTransaction();
                return res.status(status_types_1.HttpStatus.BadRequest).json({
                    success: status_types_1.ApiStatus.Info,
                    msg: "Content not found or already deleted",
                });
            }
            yield session.commitTransaction();
            session.endSession();
            return res.status(status_types_1.HttpStatus.Accepted).json({
                msg: "Content deleted successfully",
                success: status_types_1.ApiStatus.Success,
            });
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            console.log(error);
            next(error);
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
exports.contentRouter.get('/all-info', authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.userId;
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const content = yield content_model_1.ContentModel.find({ userId })
                .populate("tags")
                .session(session);
            yield session.commitTransaction();
            session.endSession();
            if (!content || content.length === 0) {
                return res.status(status_types_1.HttpStatus.Accepted).json({
                    msg: "No Content Found",
                    content: [],
                    success: status_types_1.ApiStatus.Info
                });
            }
            return res.status(status_types_1.HttpStatus.Accepted).json({
                msg: "Data Fetched",
                content,
                success: status_types_1.ApiStatus.Success
            });
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            console.log(error);
            next(error);
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
exports.contentRouter.get("/menu-list", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(status_types_1.HttpStatus.Accepted).json({
            msg: "Data Feteched",
            list: contnet_types_1.contentTypes
        });
    }
    catch (error) {
        console.log("Error ", Error);
    }
}));
exports.contentRouter.post("/semantic-search", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.body;
        const userId = req.userId;
        if (!query || typeof query !== "string") {
            return res.status(400).json({
                success: status_types_1.ApiStatus.Error,
                msg: "Query is required",
            });
        }
        const queryEmbedding = yield (0, huggingface_utils_1.getTextEmbedding)(query);
        const allContent = yield content_model_1.ContentModel.find({ userId });
        const ranked = allContent.map(item => {
            const similarity = (0, cosineSimilarity_utils_1.cosineSimilarity)(queryEmbedding, item.embedding);
            return { item, similarity };
        });
        ranked.sort((a, b) => b.similarity - a.similarity);
        const topMatches = ranked.slice(0, 10).map(r => r.item);
        return res.status(200).json({
            success: status_types_1.ApiStatus.Success,
            msg: "Semantic results fetched",
            data: topMatches,
        });
    }
    catch (error) {
        console.error("Semantic Search Error:", error);
        next(error);
    }
}));
