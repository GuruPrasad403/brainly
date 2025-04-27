import express, { Request, Response, NextFunction } from 'express';
import { PORT,db } from './config/env';
import cors from 'cors'
import { connetToTheDB } from './config/db';
import {authRouter} from './routes/auth.router'
import {HttpError} from './types/status.types'
import { contentRouter } from './routes/content.router';
const app  = express();
// accpect the request from every site
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// decode the body file to the json formate 
app.use(express.json())
// server will be 
app.use("/api/v1",authRouter)
app.use("/api/v1/content", contentRouter)
app.get("/", (req,res,next)=>{
    try {
        res.status(200).json({
            msg:"Hi this is an Second Brainly Backend"
        })
    } catch (error) {
        next(error) 
    }
})

app.use((err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); 

  // Default to 500 if no statusCode is provided
  const statusCode = 'statusCode' in err ? (err as HttpError).statusCode : 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});


  try {
    console.log(db)
    connetToTheDB(db)
    app.listen(PORT, ()=>{
        console.log("Server is Running @ http://localhost:",PORT)
    })
    
  } catch (error) {
    console.log("Failed to run the serveer check with the DB connetion")
    process.exit(1)
}