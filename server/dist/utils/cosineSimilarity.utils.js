"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = cosineSimilarity;
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + Math.pow(val, 2), 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + Math.pow(val, 2), 0));
    return dot / (magA * magB);
}
