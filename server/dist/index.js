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
const env_1 = require("./config/env");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_router_1 = require("./routes/auth.router");
const content_router_1 = require("./routes/content.router");
const link_router_1 = __importDefault(require("./routes/link.router"));
const app = (0, express_1.default)();
// accpect the request from every site
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// decode the body file to the json formate 
app.use(express_1.default.json());
// server will be 
app.use("/api/v1", auth_router_1.authRouter);
app.use("/api/v1/content", content_router_1.contentRouter);
app.use("/api/v1/link", link_router_1.default);
app.get("/", (req, res, next) => {
    try {
        res.status(200).json({
            msg: "Hi this is an Second Brainly Backend"
        });
    }
    catch (error) {
        next(error);
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Default to 500 if no statusCode is provided
    const statusCode = 'statusCode' in err ? err.statusCode : 500;
    res.status(statusCode).json({
        error: Object.assign({ message: err.message || 'Internal Server Error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack }))
    });
});
try {
    console.log(env_1.db);
    (0, db_1.connetToTheDB)(env_1.db);
    app.listen(env_1.PORT, () => {
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const respose = yield fetch("https://brainly-ld5q.onrender.com");
            const data = yield respose.json();
            console.log(data);
        }), 1000 * 60 * 2);
        console.log("Server is Running @ http://localhost:", env_1.PORT);
    });
}
catch (error) {
    console.log("Failed to run the serveer check with the DB connetion");
    process.exit(1);
}
