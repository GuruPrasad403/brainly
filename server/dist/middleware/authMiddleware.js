"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const status_types_1 = require("../types/status.types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authMiddleware = (req, res, next) => {
    try {
        const headerToken = req.headers.authorization;
        if (!headerToken || !headerToken.startsWith("Bearer ")) {
            res.status(status_types_1.HttpStatus.BadRequest).json({
                success: status_types_1.ApiStatus.Warning,
                msg: "No Token Found",
            });
            return;
        }
        const token = headerToken.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_AUTH);
            req.userId = decoded.id;
            next();
        }
        catch (jwtError) {
            const message = jwtError instanceof jsonwebtoken_1.default.TokenExpiredError
                ? "Token expired"
                : "Invalid token";
            res.status(status_types_1.HttpStatus.Unauthorized).json({
                success: status_types_1.ApiStatus.Error,
                msg: message
            });
            return;
        }
    }
    catch (error) {
        console.error("Error in Middleware", error);
        next(error);
    }
};
exports.default = authMiddleware;
