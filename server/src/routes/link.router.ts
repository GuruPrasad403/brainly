import express, {Request,Response,NextFunction} from 'express';
import { ApiStatus, HttpStatus } from '../types/status.types';
import mongoose from 'mongoose';
import { LinkModel } from '../models/link.model';
import authMiddleware from '../middleware/authMiddleware';


const linkRouter = express.Router()



linkRouter.get("/check",
    (req:Request,res:Response,next:NextFunction)=>{
        try {
            res.status(200).json({
                msg:"Hi this is Link Router"
            })
        } catch (error) {
            next(error) 
        }
    }
)       


linkRouter.post("/",
    authMiddleware, 
    // @ts-ignore
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).userId;
        const { contentId } = req.body;
  
        if (!userId || !contentId) {
          return res.status(HttpStatus.BadRequest).json({
            msg: "No userId or contentId provided",
            success: ApiStatus.Warning
          });
        }
  
        const user_id = new mongoose.Types.ObjectId(userId);
        const content_id = new mongoose.Types.ObjectId(contentId);
  
        const existingLink = await LinkModel.findOne({ userId: user_id, contentId: content_id });
        if (existingLink) {
          return res.status(HttpStatus.Conflict).json({
            msg: "Link already exists",
            success: ApiStatus.Warning,
            existingLink
          });
        }
  
        const link = await LinkModel.create({
          userId: user_id,
          contentId: content_id
        });
  
        res.status(HttpStatus.Created).json({
          msg: "Link created successfully",
          success: ApiStatus.Success,
          data: link
        });
      } catch (error) {
        console.error("Create Link Error:", error);
        next(error);
      }
    }
  );

  linkRouter.get("/", authMiddleware,
    // @ts-ignore
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).userId;
        const linkId = req.query.linkId as string;
  
        if (!userId || !linkId) {
          return res.status(HttpStatus.BadRequest).json({
            msg: "No userId or linkId provided",
            success: ApiStatus.Warning,
          });
        }
  
        const user_id = new mongoose.Types.ObjectId(userId);
  
        const linke = await LinkModel.findOne({
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
          return res.status(HttpStatus.NotFound).json({
            msg: "Link Not Found",
            success: ApiStatus.Warning,
          });
        }
  
        res.status(HttpStatus.OK).json({
          msg: "Links retrieved successfully",
          success: ApiStatus.Success,
          data: linke,
        });
      } catch (error) {
        console.error("Get Links Error:", error);
        next(error);
      }
    }
  );
  export default linkRouter