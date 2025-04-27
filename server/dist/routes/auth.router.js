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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const status_types_1 = require("../types/status.types");
const genrate_util_js_1 = __importDefault(require("../utils/genrate.util.js"));
const sendmail_util_1 = require("../utils/sendmail.util");
const user_validation_1 = require("../validations/user.validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_model_1 = require("../models/otp.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.get("/", (req, res, next) => {
    try {
        const strings = (0, genrate_util_js_1.default)();
        (0, sendmail_util_1.sendMail)("princerocky8951@gmail.com", "Basic Tesxt", `<h1>${strings} </h1>`);
        res.status(status_types_1.HttpStatus.Accepted).json({
            success: status_types_1.ApiStatus.Success,
            msg: "THis is an auth Route ",
            strings,
        });
    }
    catch (error) {
        console.log(error);
    }
});
// signup
authRouter.post("/signup", 
//@ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const userInput = req === null || req === void 0 ? void 0 : req.body;
        // Validate user input
        const valid = user_validation_1.userSchema.safeParse(userInput);
        if (!(valid === null || valid === void 0 ? void 0 : valid.success)) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                success: status_types_1.ApiStatus.Warning,
                msg: "Invalid Inputs",
                error: (_a = valid === null || valid === void 0 ? void 0 : valid.error) === null || _a === void 0 ? void 0 : _a.errors,
            });
        }
        // Hash the password
        const hashPassword = yield bcrypt_1.default.hash(valid.data.password, 10);
        // Generate OTP
        const otp = (0, genrate_util_js_1.default)();
        const hashOtp = yield bcrypt_1.default.hash(otp, 5);
        const mail = yield (0, sendmail_util_1.sendMail)((_b = valid === null || valid === void 0 ? void 0 : valid.data) === null || _b === void 0 ? void 0 : _b.email, otp, `<strong>${(_c = valid === null || valid === void 0 ? void 0 : valid.data) === null || _c === void 0 ? void 0 : _c.name}}</strong>`);
        if (!mail) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                success: status_types_1.ApiStatus.Error,
                msg: "Failed to send OTP, SignUp Again",
                error: mail,
            });
        }
        // Start the MongoDB session and transaction
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // Create user and OTP document within the session
            const user = yield user_model_1.default.create([
                {
                    email: (_d = valid === null || valid === void 0 ? void 0 : valid.data) === null || _d === void 0 ? void 0 : _d.email,
                    name: (_e = valid === null || valid === void 0 ? void 0 : valid.data) === null || _e === void 0 ? void 0 : _e.name,
                    password: hashPassword,
                },
            ], { session });
            // Create OTP document
            yield otp_model_1.OtpsModel.create([
                {
                    userId: user[0]._id,
                    otp: hashOtp,
                },
            ], { session });
            // Commit the transaction
            yield session.commitTransaction();
            // 7. JWT Token Generation
            const token = jsonwebtoken_1.default.sign({ id: user[0]._id }, env_1.JWT_AUTH, { expiresIn: "7d" });
            return res.status(status_types_1.HttpStatus.Created).json({
                success: status_types_1.ApiStatus.Success,
                msg: "Registration successful. Please verify your email.",
                user: {
                    _id: user[0]._id,
                    email: user[0].email,
                    name: user[0].name,
                },
                token,
                otp: process.env.NODE_ENV === "development" ? otp : undefined, // Only show OTP in development mode
            });
        }
        catch (dbError) {
            // If there's an error, abort the transaction
            yield session.abortTransaction();
            console.error("Error during user creation or OTP generation:", dbError);
            next(dbError);
        }
        finally {
            // Ensure session is always ended
            session.endSession();
        }
    }
    catch (error) {
        console.error("Error in the /signup route:", error);
        next(error);
    }
}));
// sign in
authRouter.post("/signin", 
//@ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(status_types_1.HttpStatus.NotFound).json({
                success: status_types_1.ApiStatus.Error,
                msg: "Account no Found",
            });
        }
        const valid = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!valid) {
            return res.status(status_types_1.HttpStatus.Forbidden).json({
                success: status_types_1.ApiStatus.Error,
                msg: "Invalid Passowrd/ Username",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, env_1.JWT_AUTH);
        res.status(status_types_1.HttpStatus.Accepted).json({
            success: status_types_1.ApiStatus.Success,
            msg: "User Logged In",
            user: {
                id: user === null || user === void 0 ? void 0 : user._id,
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
                created: user === null || user === void 0 ? void 0 : user.created,
                updated: user === null || user === void 0 ? void 0 : user.updated,
                isValid: user === null || user === void 0 ? void 0 : user.isValid,
            },
            token: token,
        });
    }
    catch (error) {
        console.log("Error while signing in ");
        next(error);
    }
}));
// verify otp
authRouter.post("/verify", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log("Verifying user:", userId);
        const otp = req.body.otp;
        const findOtp = yield otp_model_1.OtpsModel.findOne({ userId });
        if (!findOtp) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                msg: "Otp Not Found",
                success: status_types_1.ApiStatus.Info,
            });
        }
        const validOtp = yield bcrypt_1.default.compare(otp, findOtp.otp);
        if (!validOtp) {
            return res.status(status_types_1.HttpStatus.BadRequest).json({
                msg: "Invalid OTP",
                success: status_types_1.ApiStatus.Info,
            });
        }
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const validUser = yield user_model_1.default.findOne({ _id: userId }).session(session);
            if (!validUser) {
                yield session.abortTransaction();
                return res.status(status_types_1.HttpStatus.BadRequest).json({
                    msg: "User not found",
                    success: status_types_1.ApiStatus.Warning,
                });
            }
            validUser.isValid = true;
            yield validUser.save({ session });
            yield session.commitTransaction();
            return res.status(status_types_1.HttpStatus.Accepted).json({
                msg: "Verification Done ✅",
            });
        }
        catch (error) {
            yield session.abortTransaction();
            console.log("Error during transaction:", error);
            next(error);
        }
        finally {
            yield session.endSession();
        }
    }
    catch (error) {
        console.log("Error in /verify route:", error);
        next(error);
    }
}));
authRouter.put("/resend", authMiddleware_1.default, 
// @ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const otp = (0, genrate_util_js_1.default)();
        const hashedOtp = yield bcrypt_1.default.hash(otp, 5);
        let emailToSend = null;
        let name = null;
        // Try to find OTP and populate user email
        let findOtp = yield otp_model_1.OtpsModel.findOne({ userId }, null, { session })
            .populate("userId", "email");
        if (findOtp) {
            findOtp.otp = hashedOtp;
            yield findOtp.save({ session });
            emailToSend = findOtp.userId.email;
        }
        else {
            const findUser = yield user_model_1.default.findById(userId, null, { session });
            if (!findUser) {
                yield session.abortTransaction();
                return res.status(status_types_1.HttpStatus.Unauthorized).json({
                    msg: "User Not Found",
                    success: status_types_1.ApiStatus.Warning,
                });
            }
            emailToSend = findUser.email;
            name = findUser === null || findUser === void 0 ? void 0 : findUser.name;
            yield otp_model_1.OtpsModel.create([{ userId, otp: hashedOtp }], { session });
        }
        yield session.commitTransaction();
        if (!emailToSend)
            throw new Error("Email not found");
        yield (0, sendmail_util_1.sendMail)(emailToSend, otp, `<strong>${name}</strong>`);
        return res.status(status_types_1.HttpStatus.Created).json({
            msg: `OTP sent to ${emailToSend}`,
            success: status_types_1.ApiStatus.Info,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Error in /resend:", error);
        next(error);
    }
    finally {
        session.endSession();
    }
}));
