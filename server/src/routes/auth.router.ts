import express, {
  Router,
  Request,
  Response,
  NextFunction
} from "express";
import { HttpStatus, ErrorType, ApiStatus } from "../types/status.types";
import genrateUnique from "../utils/genrate.util.js";
import { sendMail } from "../utils/sendmail.util";
import { userSchema, UserValidationType } from "../validations/user.validation";
import bcrypt from "bcrypt";
import UsersModel from "../models/user.model";
import { UserModel } from "../types/userModel.types";
import { OtpsModel } from "../models/otp.model";
import jwt from "jsonwebtoken";
import { JWT_AUTH } from "../config/env";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware";
const authRouter: Router = express.Router();

authRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const strings: string = genrateUnique();
    sendMail(
      "princerocky8951@gmail.com",
      "Basic Tesxt",
      `<h1>${strings} </h1>`
    );
    res.status(HttpStatus.Accepted).json({
      success: ApiStatus.Success,
      msg: "THis is an auth Route ",
      strings,
    });
  } catch (error) {
    console.log(error);
  }
});

// signup
authRouter.post(
    "/signup",
    //@ts-ignore
    async (req: Request, res: Response, next: NextFunction) => {
    
      try {
        const userInput: UserValidationType = req?.body;
  
        // Validate user input
        const valid = userSchema.safeParse(userInput);
        if (!valid?.success) {
          return res.status(HttpStatus.BadRequest).json({
            success: ApiStatus.Warning,
            msg: "Invalid Inputs",
            error: valid?.error?.errors,
          });
        }
  
        // Hash the password
        const hashPassword: String = await bcrypt.hash(valid.data.password, 10);
        
        // Generate OTP
        const otp: string = genrateUnique();
        const hashOtp: string = await bcrypt.hash(otp, 5);
  
        const mail = await sendMail(
          valid?.data?.email,
          "OTP Verification From Brainly",
          `<h1>${otp}</h1>`
        );
        
        if (!mail) {
          return res.status(HttpStatus.BadRequest).json({
            success: ApiStatus.Error,
            msg: "Failed to send OTP, SignUp Again",
            error: mail,
          });
        }
  
        // Start the MongoDB session and transaction
        const session = await mongoose.startSession();
        session.startTransaction();
  
        try {
          // Create user and OTP document within the session
          const user = await UsersModel.create(
            [
              {
                email: valid?.data?.email,
                name: valid?.data?.name,
                password: hashPassword,
              },
            ],
            { session }
          );
  
          // Create OTP document
          await OtpsModel.create(
            [
              {
                userId: user[0]._id,
                otp: hashOtp,
              },
            ],
            { session }
          );
  
          // Commit the transaction
          await session.commitTransaction();
  
          // 7. JWT Token Generation
          const token = jwt.sign({ id: user[0]._id }, JWT_AUTH, { expiresIn: "7d" });
  
          return res.status(HttpStatus.Created).json({
            success: ApiStatus.Success,
            msg: "Registration successful. Please verify your email.",
            user: {
              _id: user[0]._id,
              email: user[0].email,
              name: user[0].name,
            },
            token,
            otp: process.env.NODE_ENV === "development" ? otp : undefined, // Only show OTP in development mode
          });
        } catch (dbError) {
          // If there's an error, abort the transaction
          await session.abortTransaction();
          console.error("Error during user creation or OTP generation:", dbError);
          next(dbError);
        } finally {
          // Ensure session is always ended
          session.endSession();
        }
      } catch (error) {
        console.error("Error in the /signup route:", error);
        next(error);
      }
    }
  );
  // sign in

authRouter.post(
  "/signin",
  //@ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await UsersModel.findOne({ email });
      if (!user) {
        return res.status(HttpStatus.NotFound).json({
          success: ApiStatus.Error,
          msg: "Account no Found",
        });
      }
      const valid = await bcrypt.compare(password, user?.password);
      if (!valid) {
        return res.status(HttpStatus.Forbidden).json({
          success: ApiStatus.Error,
          msg: "Invalid Passowrd/ Username",
        });
      }
      const token = jwt.sign({ id: user?._id }, JWT_AUTH);
      res.status(HttpStatus.Accepted).json({
        success: ApiStatus.Success,
        msg: "User Logged In",
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          created: user?.created,
          updated: user?.updated,
          isValid: user?.isValid,
        },
        token: token,
      });
    } catch (error) {
      console.log("Error while signing in ");
      next(error);
    }
  }
);

// verify otp
authRouter.post(
  "/verify",
  authMiddleware,
  // @ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      console.log("Verifying user:", userId);

      const otp: string = req.body.otp;
      const findOtp = await OtpsModel.findOne({ userId });

      if (!findOtp) {
        return res.status(HttpStatus.BadRequest).json({
          msg: "Otp Not Found",
          success: ApiStatus.Info,
        });
      }

      const validOtp = await bcrypt.compare(otp, findOtp.otp);
      if (!validOtp) {
        return res.status(HttpStatus.BadRequest).json({
          msg: "Invalid OTP",
          success: ApiStatus.Info,
        });
      }

      const session: mongoose.mongo.ClientSession = await mongoose.startSession();
      session.startTransaction();

      try {
        const validUser = await UsersModel.findOne({ _id: userId }).session(session);

        if (!validUser) {
          await session.abortTransaction();
          return res.status(HttpStatus.BadRequest).json({
            msg: "User not found",
            success: ApiStatus.Warning,
          });
        }

        (validUser as any).isValid = true;
        await validUser.save({ session });

        await session.commitTransaction();

        return res.status(HttpStatus.Accepted).json({
          msg: "Verification Done ✅",
        });
      } catch (error) {
        await session.abortTransaction();
        console.log("Error during transaction:", error);
        next(error);
      } finally {
        await session.endSession();
      }

    } catch (error) {
      console.log("Error in /verify route:", error);
      next(error);
    }
  }
);

authRouter.put(
    "/resend",
    authMiddleware,
    // @ts-ignore
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).userId;
  
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        const otp = genrateUnique();
        const hashedOtp = await bcrypt.hash(otp, 5);
  
        let emailToSend: string | null = null;
  
        // Try to find OTP and populate user email
        let findOtp = await OtpsModel.findOne({ userId }, null, { session })
          .populate<{ userId: { email: string } }>("userId", "email");
  
        if (findOtp) {
          findOtp.otp = hashedOtp;
          await findOtp.save({ session });
          emailToSend = findOtp.userId.email;
        } else {
          const findUser = await UsersModel.findById(userId, null, { session });
          if (!findUser) {
            await session.abortTransaction();
            return res.status(HttpStatus.Unauthorized).json({
              msg: "User Not Found",
              success: ApiStatus.Warning,
            });
          }
  
          emailToSend = findUser.email;
          await OtpsModel.create([{ userId, otp: hashedOtp }], { session });
        }
  
        await session.commitTransaction();
  
        if (!emailToSend) throw new Error("Email not found");
  
        await sendMail(emailToSend, "Resent OTP Verification", `<h1>${otp}</h1>`);
  
        return res.status(HttpStatus.Created).json({
          msg: `OTP sent to ${emailToSend}`,
          success: ApiStatus.Info,
        });
  
      } catch (error) {
        await session.abortTransaction();
        console.error("Error in /resend:", error);
        next(error);
      } finally {
        session.endSession();
      }
    }
  );
    
export { authRouter };
