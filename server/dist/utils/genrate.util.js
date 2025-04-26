"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shortid_1 = __importDefault(require("shortid"));
const genrateUnique = () => {
    try {
        const id = shortid_1.default.generate();
        const trim = id === null || id === void 0 ? void 0 : id.slice(0, 6);
        return trim;
    }
    catch (error) {
        console.log(error);
        return "";
    }
};
exports.default = genrateUnique;
