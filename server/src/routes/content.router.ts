import express,{Request,Response,NextFunction} from 'express';
import { ApiStatus, HttpStatus } from '../types/status.types';
import authMiddleware from '../middleware/authMiddleware';
import { contentSchema } from '../validations/content.validations';
import { ContentModel } from '../models/content.model';
import { TagModel } from '../models/types.model';
import mongoose from 'mongoose';
import { contentTypes } from '../types/contnet.types';
import { getTextEmbedding } from '../utils/huggingface.utils';
import { cosineSimilarity } from '../utils/cosineSimilarity.utils';

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
const fullText = `${title} ${description} ${link}`;
const embedding = await getTextEmbedding(fullText);
      const content = await ContentModel.create({
        userId,
        link,
        title,
        type,
        description, 
        tags: tagIds,
        embedding, 
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

contentRouter.put("/", authMiddleware,
// @ts-ignore
async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id as string;
    const _id = new mongoose.Types.ObjectId(id);
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
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
      const findContent = await ContentModel.findById(_id).session(session);
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
      (findContent as any).description = valid.data.description;

      const updatedText = `${valid.data.title} ${valid.data.description} ${valid.data.link}`;
      const embedding = await getTextEmbedding(updatedText);
      (findContent as any).embedding = embedding;

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
        data: { _id: findContent._id,
          title: findContent.title,
          link: findContent.link,
          type: findContent.type,
          description: findContent.description,
          tags: findContent.tags,
          userId: findContent.userId,         
        }
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
});

  
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




contentRouter.post("/semantic-search", authMiddleware,
  // @ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.body;
      const userId = (req as any).userId;

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          success: ApiStatus.Error,
          msg: "Query is required",
        });
      }

      const queryEmbedding = await getTextEmbedding(query);
      const allContent = await ContentModel.find({ userId });

      const ranked = allContent
      .filter(item => Array.isArray(item.embedding) && item.embedding.length > 0)
      .map(item => {
        const similarity = cosineSimilarity(queryEmbedding, item.embedding);
        console.log(`[DEBUG] ${item.title} => similarity: ${similarity.toFixed(4)}`);
        return { item, similarity };
      })
      .filter(r => r.similarity > 0.3);

      ranked.sort((a, b) => b.similarity - a.similarity);

      const topMatches = ranked.slice(0, 10).map(({ item }) => {
        const { embedding, ...rest } = item.toObject(); 
        return rest;
      });
      return res.status(200).json({
        success: ApiStatus.Success,
        msg: "Semantic results fetched",
        data: topMatches,
      });
      
    } catch (error) {
      console.error("Semantic Search Error:", error);
      next(error);
    }
  }
);
