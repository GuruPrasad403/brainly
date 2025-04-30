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
exports.getTextEmbedding = getTextEmbedding;
const inference_1 = require("@huggingface/inference");
const hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY);
function getTextEmbedding(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text,
        });
        if (!Array.isArray(response)) {
            throw new Error("Embedding response is not valid");
        }
        return response;
    });
}
