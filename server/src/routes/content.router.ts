import express,{Request,Response,NextFunction} from 'express';
import { ApiStatus, HttpStatus } from '../types/status.types';
import authMiddleware from '../middleware/authMiddleware';
import { contentSchema } from '../validations/content.validations';
import { ContentModel } from '../models/content.model';
import { TagModel } from '../models/types.model';
import mongoose from 'mongoose';
import { contentTypes } from '../types/contnet.types';

export const contentRouter = express.Router();

contentRouter.get("/", (req, res, next) => {
  try {
    res.status(HttpStatus.Accepted).json({
      msg: "This is a Content Router",
      success: ApiStatus.Success,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

contentRouter.post(
  "/content",
  authMiddleware,
  // @ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;

      const valid = contentSchema.safeParse(req.body);
      if (!valid.success) {
        return res.status(HttpStatus.BadRequest).json({
          success: ApiStatus.Error,
          msg: "Invalid Inputs",
          error: valid?.error.errors,
        });
      }

      const { link, title, type, description, tags: tagTitles } = valid.data;

  const tagIds = [];
  if (tagTitles) {
  for (const tagTitle of tagTitles) {
    let tag = await TagModel.findOne({ title: tagTitle });

    if (!tag) {
      tag = await TagModel.create({ title: tagTitle });
    }

    tagIds.push(tag._id);
  }
} else {
  console.log("No tags provided");
}

      const content = await ContentModel.create({
        userId,
        link,
        title,
        type,
        description, 
        tags: tagIds,
      });

      return res.status(HttpStatus.Created).json({
        success: ApiStatus.Success,
        msg: "Content created successfully",
        data: content,
      });
    } catch (error) {
      console.error("Error in /content:", error);
      next(error);
    }
  }
);

//   update contet 

contentRouter.put("/", authMiddleware,
    // @ts-ignore
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.query.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(HttpStatus.BadRequest).json({
            success: ApiStatus.Error,
            msg: "Invalid content ID",
          });
        }
  
        const valid = contentSchema.safeParse(req.body);
        if (!valid.success) {
          return res.status(HttpStatus.BadRequest).json({
            success: ApiStatus.Error,
            msg: "Invalid Inputs",
            error: valid.error.errors,
          });
        }
  
        const session = await mongoose.startSession();
        session.startTransaction();
  
        try {
          const findContent = await ContentModel.findById(id).session(session);
          if (!findContent) {
            await session.abortTransaction();
            return res.status(HttpStatus.BadRequest).json({
              msg: "No data to update",
              success: ApiStatus.Info,
            });
          }
  
          (findContent as any).title = valid.data.title;
          (findContent as any).link = valid.data.link;
          (findContent as any).type = valid.data.type;
  
          // If you want to update tags too:
          if (valid.data.tags) {
            const tagIds = [];
            for (const tagTitle of valid.data.tags) {
              let tag = await TagModel.findOne({ title: tagTitle });
              if (!tag) tag = await TagModel.create({ title: tagTitle });
              tagIds.push(tag._id);
            }
            (findContent as any).tags = tagIds;
          }
  
          await findContent.save({ session });
          await session.commitTransaction();
          session.endSession();
  
          return res.status(HttpStatus.Accepted).json({
            success: ApiStatus.Success,
            msg: "Content updated successfully",
            data: findContent,
          });
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error(error);
          next(error);
        }
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  );
  
  contentRouter.delete("/", authMiddleware,
    // @ts-ignore
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.query.id as string;
  
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(HttpStatus.BadRequest).json({
            success: ApiStatus.Info,
            msg: "Invalid or missing ID",
          });
        }
  
        const session = await mongoose.startSession();
        session.startTransaction();
  
        try {
          const content = await ContentModel.findByIdAndDelete({_id:id}, { session });
  
          if (!content) {
            await session.abortTransaction();
            return res.status(HttpStatus.BadRequest).json({
              success: ApiStatus.Info,
              msg: "Content not found or already deleted",
            });
          }
  
          await session.commitTransaction();
          session.endSession();
  
          return res.status(HttpStatus.Accepted).json({
            msg: "Content deleted successfully",
            success: ApiStatus.Success,
          });
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.log(error);
          next(error);
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );


  contentRouter.get('/all-info', authMiddleware, 
    // @ts-ignore
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any)?.userId;
  
        const session = await mongoose.startSession();
        session.startTransaction();
  
        try {
          const content = await ContentModel.find({ userId })
            .populate("tags") 
            .session(session);
  
          await session.commitTransaction();
          session.endSession();
  
          if (!content || content.length === 0) {
            return res.status(HttpStatus.Accepted).json({
              msg: "No Content Found",
              content: [],
              success: ApiStatus.Info
            });
          }
  
          return res.status(HttpStatus.Accepted).json({
            msg: "Data Fetched",
            content,
            success: ApiStatus.Success
          });
  
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.log(error);
          next(error);
        }
  
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  
  contentRouter.get("/menu-list", authMiddleware, 
    // @ts-ignore
    async(req:Request,res:Response,next:NextFunction)=>{
        try {
          res.status(HttpStatus.Accepted).json({
            msg:"Data Feteched",
            list : contentTypes
          })
        } catch (error) {
          console.log("Error ", Error)
        }
    }
  )